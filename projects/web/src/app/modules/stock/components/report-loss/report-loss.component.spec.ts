import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLossComponent } from './report-loss.component';

describe('ReportLossComponent', () => {
  let component: ReportLossComponent;
  let fixture: ComponentFixture<ReportLossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportLossComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
