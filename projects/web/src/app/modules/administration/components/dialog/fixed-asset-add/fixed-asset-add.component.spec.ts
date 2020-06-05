import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetAddComponent } from './fixed-asset-add.component';

describe('FixedAssetAddComponent', () => {
  let component: FixedAssetAddComponent;
  let fixture: ComponentFixture<FixedAssetAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedAssetAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAssetAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
