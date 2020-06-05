import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutInManagementComponent } from './stock-out-in-management.component';

describe('StockOutInManagementComponent', () => {
  let component: StockOutInManagementComponent;
  let fixture: ComponentFixture<StockOutInManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockOutInManagementComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOutInManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
