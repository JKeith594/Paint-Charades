import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickWordWindowComponent } from './pick-word-window.component';

describe('PickWordWindowComponent', () => {
  let component: PickWordWindowComponent;
  let fixture: ComponentFixture<PickWordWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickWordWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickWordWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
