import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '../../../../shared/types/user.types';
import { UserDetailsFormComponent } from './user-details-form.component';

describe('UserDetailsFormComponent', () => {
    let component: UserDetailsFormComponent;
    let fixture: ComponentFixture<UserDetailsFormComponent>;

    const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        balance: 0,
        currency: 'DKK',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserDetailsFormComponent],
            providers: [provideHttpClient()],
        }).compileComponents();

        fixture = TestBed.createComponent(UserDetailsFormComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('user', mockUser);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
