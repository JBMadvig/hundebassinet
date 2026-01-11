import { Injectable, signal } from '@angular/core';
import { mockUsers } from 'app/pages/pos/testdata';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    public user = mockUsers[0];

    public userData = signal(this.user);

    constructor() { }
}
