import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResumesComponent } from './view-resumes.component';

describe('ViewResumesComponent', () => {
  let component: ViewResumesComponent;
  let fixture: ComponentFixture<ViewResumesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewResumesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewResumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
