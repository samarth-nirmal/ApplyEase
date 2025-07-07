import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResumeOptionsComponent } from './create-resume-options.component';

describe('CreateResumeOptionsComponent', () => {
  let component: CreateResumeOptionsComponent;
  let fixture: ComponentFixture<CreateResumeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateResumeOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateResumeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
