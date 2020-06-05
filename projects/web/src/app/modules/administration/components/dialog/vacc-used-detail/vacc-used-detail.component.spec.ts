import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccUsedDetailComponent } from './vacc-used-detail.component';

describe('VaccUsedDetailComponent', () => {
  let component: VaccUsedDetailComponent;
  let fixture: ComponentFixture<VaccUsedDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaccUsedDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccUsedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
