import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarUserDetailsComponent } from './sidebar-user-details.component';

describe('SidebarUserDetailsComponent', () => {
  let component: SidebarUserDetailsComponent;
  let fixture: ComponentFixture<SidebarUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarUserDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
