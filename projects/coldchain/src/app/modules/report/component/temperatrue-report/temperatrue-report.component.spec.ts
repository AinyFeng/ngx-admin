import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatrueReportComponent } from './temperatrue-report.component';

describe('TemperatrueReportComponent', () => {
  let component: TemperatrueReportComponent;
  let fixture: ComponentFixture<TemperatrueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatrueReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatrueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
