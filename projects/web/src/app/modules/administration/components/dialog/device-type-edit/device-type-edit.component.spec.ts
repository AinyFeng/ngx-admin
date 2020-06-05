import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeEditComponent } from './device-type-edit.component';

describe('DeviceTypeEditComponent', () => {
  let component: DeviceTypeEditComponent;
  let fixture: ComponentFixture<DeviceTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
