import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockWarningComponent } from './stock-warning.component';

describe('StockWarningComponent', () => {
  let component: StockWarningComponent;
  let fixture: ComponentFixture<StockWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockWarningComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
