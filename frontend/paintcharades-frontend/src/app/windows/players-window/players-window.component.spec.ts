import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersWindowComponent } from './players-window.component';

describe('PlayersWindowComponent', () => {
  let component: PlayersWindowComponent;
  let fixture: ComponentFixture<PlayersWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
