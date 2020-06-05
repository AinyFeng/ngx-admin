import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchInjectBackComponent } from './batch-inject-back.component';

describe('BatchInjectBackComponent', () => {
  let component: BatchInjectBackComponent;
  let fixture: ComponentFixture<BatchInjectBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchInjectBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchInjectBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
