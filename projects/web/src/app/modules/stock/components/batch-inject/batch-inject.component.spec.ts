import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchInjectComponent } from './batch-inject.component';

describe('BatchInjectComponent', () => {
  let component: BatchInjectComponent;
  let fixture: ComponentFixture<BatchInjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BatchInjectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchInjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
