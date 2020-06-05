import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisscussOutInComponent } from './disscuss-out-in.component';

describe('DisscussOutInComponent', () => {
  let component: DisscussOutInComponent;
  let fixture: ComponentFixture<DisscussOutInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisscussOutInComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisscussOutInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
