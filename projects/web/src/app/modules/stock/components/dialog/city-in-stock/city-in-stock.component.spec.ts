import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityInStockComponent } from './city-in-stock.component';

describe('CityInStockComponent', () => {
  let component: CityInStockComponent;
  let fixture: ComponentFixture<CityInStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityInStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityInStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
