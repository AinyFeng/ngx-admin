import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurisdictionAlertComponent } from './jurisdiction-alert.component';

describe('JurisdictionAlertComponent', () => {
  let component: JurisdictionAlertComponent;
  let fixture: ComponentFixture<JurisdictionAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JurisdictionAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JurisdictionAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
