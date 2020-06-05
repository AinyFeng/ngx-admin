import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAlertComponent } from './device-alert.component';

describe('DeviceAlertComponent', () => {
  let component: DeviceAlertComponent;
  let fixture: ComponentFixture<DeviceAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
