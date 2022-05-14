import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickIconWindowComponent } from './pick-icon-window.component';

describe('PickIconWindowComponent', () => {
  let component: PickIconWindowComponent;
  let fixture: ComponentFixture<PickIconWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickIconWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickIconWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
