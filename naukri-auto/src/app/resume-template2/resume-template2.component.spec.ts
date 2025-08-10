import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTemplate2Component } from './resume-template2.component';

describe('ResumeTemplate2Component', () => {
  let component: ResumeTemplate2Component;
  let fixture: ComponentFixture<ResumeTemplate2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeTemplate2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeTemplate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
