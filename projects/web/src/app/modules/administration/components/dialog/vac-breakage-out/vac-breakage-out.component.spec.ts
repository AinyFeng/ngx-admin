import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacBreakageOutComponent } from './vac-breakage-out.component';

describe('VacBreakageOutComponent', () => {
  let component: VacBreakageOutComponent;
  let fixture: ComponentFixture<VacBreakageOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacBreakageOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacBreakageOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
