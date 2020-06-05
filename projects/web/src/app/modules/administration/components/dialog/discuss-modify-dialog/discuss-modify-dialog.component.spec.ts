import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussModifyDialogComponent } from './discuss-modify-dialog.component';

describe('DiscussModifyDialogComponent', () => {
  let component: DiscussModifyDialogComponent;
  let fixture: ComponentFixture<DiscussModifyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussModifyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussModifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
