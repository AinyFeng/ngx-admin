import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfStorageAddComponent } from './self-storage-add.component';

describe('SelfStorageAddComponent', () => {
  let component: SelfStorageAddComponent;
  let fixture: ComponentFixture<SelfStorageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfStorageAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfStorageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
