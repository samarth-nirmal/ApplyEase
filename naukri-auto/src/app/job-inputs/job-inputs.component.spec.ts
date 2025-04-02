import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInputsComponent } from './job-inputs.component';

describe('JobInputsComponent', () => {
  let component: JobInputsComponent;
  let fixture: ComponentFixture<JobInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobInputsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
