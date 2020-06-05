import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysWorkingTimeAddComponent } from './sys-working-time-add.component';

describe('SysWorkingTimeAddComponent', () => {
  let component: SysWorkingTimeAddComponent;
  let fixture: ComponentFixture<SysWorkingTimeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysWorkingTimeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysWorkingTimeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
