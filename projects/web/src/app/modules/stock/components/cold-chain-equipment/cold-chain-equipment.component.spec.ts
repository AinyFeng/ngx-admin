import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColdChainEquipmentComponent } from './cold-chain-equipment.component';

describe('ColdChainEquipmentComponent', () => {
  let component: ColdChainEquipmentComponent;
  let fixture: ComponentFixture<ColdChainEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColdChainEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColdChainEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
