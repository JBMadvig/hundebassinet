import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../../../../../../shared/services/auth.service';
import { User } from '../../../../../../shared/types/user.types';
import { SidebarUserDetailsComponent } from './sidebar-user-details.component';

describe('SidebarUserDetailsComponent', () => {
    let component: SidebarUserDetailsComponent;
    let fixture: ComponentFixture<SidebarUserDetailsComponent>;

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
            imports: [SidebarUserDetailsComponent],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        currentUser: signal(mockUser),
                        currencyInfo: computed(() => ({ locale: 'da-DK', currency: 'DKK', currencySymbol: 'kr.' })),
                        isAdmin: computed(() => false),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarUserDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
