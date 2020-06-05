import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRecordReportComponent } from './device-record-report.component';

describe('DeviceRecordReportComponent', () => {
  let component: DeviceRecordReportComponent;
  let fixture: ComponentFixture<DeviceRecordReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceRecordReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceRecordReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
