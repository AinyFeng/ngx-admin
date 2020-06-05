import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyInventoryComponent } from './daily-inventory.component';

describe('DailyInventoryComponent', () => {
  let component: DailyInventoryComponent;
  let fixture: ComponentFixture<DailyInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyInventoryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
