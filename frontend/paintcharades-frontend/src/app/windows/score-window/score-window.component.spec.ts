import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreWindowComponent } from './score-window.component';

describe('ScoreWindowComponent', () => {
  let component: ScoreWindowComponent;
  let fixture: ComponentFixture<ScoreWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
