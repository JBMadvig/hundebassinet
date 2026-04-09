import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    public errorOccurred = signal(false);
    public errorMessage = signal<string | null>(null);
    public location = signal<string | null>(null);

    public handleError(error: unknown, location?: string) {
        if (location) {
            this.location.set(location);
        }
        if (error instanceof HttpErrorResponse) {
            console.error('HTTP error occurred:', error);
            const message = error.error?.message || error.message || 'An unknown HTTP error occurred.';
            this.errorMessage.set(`${message} (HTTP ${error.status} -  ${error.url})`);
            this.errorOccurred.set(true);
            return;
        }

        if (error instanceof Error) {
            console.error('An error occurred:', error);
            this.errorMessage.set(error.message);
            this.errorOccurred.set(true);
            return;
        }


        console.error('An unknown error occurred:', error);
        this.errorMessage.set(JSON.stringify(error) || 'An unknown error occurred.');
        this.errorOccurred.set(true);
    }

    public clearError() {
        this.errorOccurred.set(false);
        this.errorMessage.set(null);
    }
}
