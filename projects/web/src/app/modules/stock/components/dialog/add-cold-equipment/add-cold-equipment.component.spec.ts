import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColdEquipmentComponent } from './add-cold-equipment.component';

describe('AddColdEquipmentComponent', () => {
  let component: AddColdEquipmentComponent;
  let fixture: ComponentFixture<AddColdEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddColdEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddColdEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
