import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '@environment';

import { Item } from '../types/items.types';
import { mapItemFrom } from '../utils/map-inventory';

type ScanResult =
| { item: Item; currency: string; barcode?: never }
| { barcode: string; item?: never; currency?: never };

@Injectable({
    providedIn: 'root',
})
export class ItemScannerService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/items`;

    public scan(barcode: string, targetUserId: string) {
        return this.http.post<ScanResult>(`${this.apiUrl}/scan`, { barcode, targetUserId }).pipe(
            map((resp) => ({
                ...resp,
                item: resp.item ? mapItemFrom(resp.item) : undefined })),
        );
    }
}
