import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityStockRefuseComponent } from './city-stock-refuse.component';

describe('CityStockRefuseComponent', () => {
  let component: CityStockRefuseComponent;
  let fixture: ComponentFixture<CityStockRefuseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityStockRefuseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityStockRefuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
