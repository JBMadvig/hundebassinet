import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../../shared/services/auth.service';
import { User } from '../../../../shared/types/user.types';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

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
            imports: [SettingsComponent],
            providers: [
                provideRouter([]),
                {
                    provide: AuthService,
                    useValue: {
                        currentUser: signal(mockUser),
                        isAdmin: signal(false),
                        currencyInfo: signal({ locale: 'da-DK', currency: 'DKK' }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('visible', false);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
