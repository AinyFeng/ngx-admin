import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfferOutInComponent } from './transffer-out-in.component';

describe('TransfferOutInComponent', () => {
  let component: TransfferOutInComponent;
  let fixture: ComponentFixture<TransfferOutInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransfferOutInComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfferOutInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
