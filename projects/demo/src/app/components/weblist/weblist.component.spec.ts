import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeblistComponent } from './weblist.component';

describe('WeblistComponent', () => {
  let component: WeblistComponent;
  let fixture: ComponentFixture<WeblistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeblistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeblistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
