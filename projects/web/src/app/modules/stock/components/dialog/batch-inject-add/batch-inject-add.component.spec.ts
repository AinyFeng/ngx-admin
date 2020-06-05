import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchInjectAddComponent } from './batch-inject-add.component';

describe('BatchInjectAddComponent', () => {
  let component: BatchInjectAddComponent;
  let fixture: ComponentFixture<BatchInjectAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BatchInjectAddComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchInjectAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
