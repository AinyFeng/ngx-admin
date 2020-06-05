import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherOutInComponent } from './other-out-in.component';

describe('OtherOutInComponent', () => {
  let component: OtherOutInComponent;
  let fixture: ComponentFixture<OtherOutInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OtherOutInComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherOutInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
