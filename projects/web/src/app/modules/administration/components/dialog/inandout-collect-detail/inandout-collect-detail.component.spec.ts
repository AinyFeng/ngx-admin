import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InandoutCollectDetailComponent } from './inandout-collect-detail.component';

describe('InandoutCollectDetailComponent', () => {
  let component: InandoutCollectDetailComponent;
  let fixture: ComponentFixture<InandoutCollectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InandoutCollectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InandoutCollectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
