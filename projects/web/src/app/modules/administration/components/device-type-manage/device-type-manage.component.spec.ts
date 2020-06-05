import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeManageComponent } from './device-type-manage.component';

describe('DeviceTypeManageComponent', () => {
  let component: DeviceTypeManageComponent;
  let fixture: ComponentFixture<DeviceTypeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceTypeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
