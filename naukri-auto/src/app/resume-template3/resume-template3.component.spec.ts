import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTemplate3Component } from './resume-template3.component';

describe('ResumeTemplate3Component', () => {
  let component: ResumeTemplate3Component;
  let fixture: ComponentFixture<ResumeTemplate3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeTemplate3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeTemplate3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
