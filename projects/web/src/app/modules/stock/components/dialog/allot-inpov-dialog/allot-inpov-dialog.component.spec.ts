import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotInpovDialogComponent } from './allot-inpov-dialog.component';

describe('AllotInpovDialogComponent', () => {
  let component: AllotInpovDialogComponent;
  let fixture: ComponentFixture<AllotInpovDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotInpovDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotInpovDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
