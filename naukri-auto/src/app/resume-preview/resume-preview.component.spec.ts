import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumePreviewComponent } from './resume-preview.component';

describe('ResumePreviewComponent', () => {
  let component: ResumePreviewComponent;
  let fixture: ComponentFixture<ResumePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
