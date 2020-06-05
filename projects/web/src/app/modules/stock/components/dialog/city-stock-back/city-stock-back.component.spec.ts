import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityStockBackComponent } from './city-stock-back.component';

describe('CityStockBackComponent', () => {
  let component: CityStockBackComponent;
  let fixture: ComponentFixture<CityStockBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityStockBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityStockBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
