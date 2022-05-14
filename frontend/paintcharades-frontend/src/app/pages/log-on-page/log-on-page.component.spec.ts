import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOnPageComponent } from './log-on-page.component';

describe('LogOnPageComponent', () => {
  let component: LogOnPageComponent;
  let fixture: ComponentFixture<LogOnPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogOnPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
