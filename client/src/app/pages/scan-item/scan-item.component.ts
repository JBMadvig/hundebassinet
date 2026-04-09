import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';

import { ButtonComponent } from '@components/button/button.component';
import { AuthService } from '@services/auth.service';
import { ItemScannerService } from '@services/item-scanner.service';

@Component({
    selector: 'app-scan-item',
    imports: [
        ButtonComponent,
        CommonModule  ],
    templateUrl: './scan-item.component.html',
})
export class ScanItemComponent implements AfterViewInit, OnDestroy {
    private authService = inject(AuthService);
    private itemScannerService = inject(ItemScannerService);
    private router = inject(Router);

    private barcodeReaderRef = viewChild<ElementRef>('barcodeReader');
    private barcodeScanner?: Html5Qrcode;
    private isProcessing = false;

    public error = signal<string | null>(null);
    public toast = signal<string | null>(null);
    public toastType = signal<'success' | 'error'>('success');
    public useFallback = signal(false);

    ngAfterViewInit() {
        this.startScanner();
    }

    public async startScanner() {
        this.error.set(null);
        this.stopScanner();

        const barcodeScannerElement = this.barcodeReaderRef();
        if (!barcodeScannerElement) return;

        try {
            this.barcodeScanner = new Html5Qrcode(barcodeScannerElement.nativeElement.id);
            await this.barcodeScanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => this.onScanSuccess(decodedText),
                () => {},
            );
        } catch (err) {
            console.error('Scanner init failed:', err);
            this.useFallback.set(true);
        }
    }

    public async onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        input.value = '';

        // Prefer the native BarcodeDetector API (Safari 17+ / iOS 17+) — it handles
        // phone camera images reliably without canvas workarounds.
        if ('BarcodeDetector' in window) {
            try {
                type BarcodeDetectorType = new (options: { formats: string[] }) => { detect(image: ImageBitmap): Promise<{ rawValue: string }[]> };
                type BarcodeDetectorStatic = BarcodeDetectorType & { getSupportedFormats(): Promise<string[]> };
                const BarcodeDetector = (window as Record<string, unknown>)['BarcodeDetector'] as BarcodeDetectorStatic;
                const formats = await BarcodeDetector.getSupportedFormats();
                const detector = new BarcodeDetector({ formats });
                const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
                const codes = await detector.detect(bitmap);
                if (codes.length > 0) {
                    this.onScanSuccess(codes[0].rawValue);
                } else {
                    this.showToast('No barcode found in image', 'error');
                }
            } catch (err) {
                this.showToast(`Scan error: ${err instanceof Error ? err.message : String(err)}`, 'error');
            }
            return;
        }

        // Fallback for older browsers: try multiple scales with Html5Qrcode.
        // ZXing scans horizontal/vertical lines, so the scale that places those lines
        // through the barcode bars matters. 600px matches typical webcam resolution.
        createImageBitmap(file, { imageOrientation: 'from-image' })
            .then((bitmap) => this.scanAtScales(bitmap, [ 600, 900, 1280 ]))
            .catch((err) => this.showToast(`Image error: ${err instanceof Error ? err.message : String(err)}`, 'error'));
    }

    private async scanAtScales(bitmap: ImageBitmap, scales: number[]): Promise<void> {
        for (const maxPx of scales) {
            const scale = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
            const w = Math.round(bitmap.width * scale);
            const h = Math.round(bitmap.height * scale);
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);

            try {
                const blob = await new Promise<Blob>((resolve, reject) =>
                    canvas.toBlob((b) => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/jpeg', 0.92));
                const file = new File([ blob ], 'scan.jpg', { type: 'image/jpeg' });
                const el = document.getElementById('file-scanner');
                if (el) el.innerHTML = '';
                const text = await new Html5Qrcode('file-scanner').scanFile(file, false);
                this.onScanSuccess(text);
                return;
            } catch {
                // Try next scale
            }
        }
        this.showToast('No barcode detected. Try a clearer photo.', 'error');
    }

    private onScanSuccess(barcode: string) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        const userId = this.authService.currentUser()?.id;
        if (!userId) {
            this.showToast('Not logged in', 'error');
            this.isProcessing = false;
            return;
        }

        this.itemScannerService.scan(barcode, userId).subscribe({
            next: (result) => {
                if (result.barcode) {
                    this.showToast(`Barcode scanned: ${result.barcode}`, 'success');
                } else {
                    this.showToast(`Added: ${result.item?.name}`, 'success');
                }
            },
            error: (err) => {
                const detail = err.error?.message || err.message || JSON.stringify(err);
                const status = err.status ? ` [${err.status}]` : '';
                this.showToast(`Scan failed${status}: ${detail}`, 'error');
            },
        });
    }

    private showToast(message: string, type: 'success' | 'error') {
        this.toast.set(message);
        this.toastType.set(type);
        setTimeout(() => {
            this.toast.set(null);
            this.isProcessing = false;
        }, 5000);
    }

    private stopScanner() {
        try {
            this.barcodeScanner?.stop().catch(() => {});
        } catch {
            // Scanner already stopped
        }
        this.barcodeScanner = undefined;
    }

    ngOnDestroy() {
        this.stopScanner();
    }

    public goBackToQR() {
        this.router.navigate([ '/qr-display' ]);
    }
}
