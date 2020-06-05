import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyInventoryComponent } from './monthly-inventory.component';

describe('MonthlyInventoryComponent', () => {
  let component: MonthlyInventoryComponent;
  let fixture: ComponentFixture<MonthlyInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyInventoryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
