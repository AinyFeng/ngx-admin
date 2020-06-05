import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfStorageInComponent } from './self-storage-in.component';

describe('SelfStorageInComponent', () => {
  let component: SelfStorageInComponent;
  let fixture: ComponentFixture<SelfStorageInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfStorageInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfStorageInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
