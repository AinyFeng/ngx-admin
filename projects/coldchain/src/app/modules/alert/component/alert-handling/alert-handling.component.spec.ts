import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertHandlingComponent } from './alert-handling.component';

describe('AlertHandlingComponent', () => {
  let component: AlertHandlingComponent;
  let fixture: ComponentFixture<AlertHandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertHandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
