import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureHumidityAlertComponent } from './temperature-humidity-alert.component';

describe('TemperatureHumidityAlertComponent', () => {
  let component: TemperatureHumidityAlertComponent;
  let fixture: ComponentFixture<TemperatureHumidityAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureHumidityAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureHumidityAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
