import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityInDetailComponent } from './city-in-detail.component';

describe('CityInDetailComponent', () => {
  let component: CityInDetailComponent;
  let fixture: ComponentFixture<CityInDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityInDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityInDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
