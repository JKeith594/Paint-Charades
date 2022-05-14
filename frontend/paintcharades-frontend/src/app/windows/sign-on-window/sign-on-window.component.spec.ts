import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOnWindowComponent } from './sign-on-window.component';

describe('SignOnWindowComponent', () => {
  let component: SignOnWindowComponent;
  let fixture: ComponentFixture<SignOnWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignOnWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOnWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
