import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

import { environment } from '@environment';

import { CreateItemRequest, CreateItemResponse, InventoryRequest, InventoryResponse } from '../types/items.types';
import { mapItemFrom } from '../utils/map-inventory';

@Injectable({
    providedIn: 'root',
})
export class InventoryService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/items`;

    // Search the inventory for /inventory page
    public searchInventoryItems(body: InventoryRequest): Promise<InventoryResponse> {
        return firstValueFrom(
            this.http.post<InventoryResponse>(`${this.apiUrl}/get-items-inventory`, body).pipe(
                map((resp) => ({ ...resp, items: resp.items.map(mapItemFrom) })),
            ),
        );
    }

    public createItem(body: CreateItemRequest): Promise<CreateItemResponse> {
        return firstValueFrom(
            this.http.post<CreateItemResponse>(`${this.apiUrl}/create-item`, body).pipe(
                map((resp) => ({ itemAdded: mapItemFrom(resp.itemAdded) })),
            ),
        );
    }
}
