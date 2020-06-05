import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysHolidayAddComponent } from './sys-holiday-add.component';

describe('SysHolidayAddComponent', () => {
  let component: SysHolidayAddComponent;
  let fixture: ComponentFixture<SysHolidayAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysHolidayAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysHolidayAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
