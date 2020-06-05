import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysHolidayConfComponent } from './sys-holiday-conf.component';

describe('SysHolidayConfComponent', () => {
  let component: SysHolidayConfComponent;
  let fixture: ComponentFixture<SysHolidayConfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysHolidayConfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysHolidayConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
