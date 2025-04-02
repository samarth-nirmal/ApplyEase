import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchedJobsComponent } from './fetched-jobs.component';

describe('FetchedJobsComponent', () => {
  let component: FetchedJobsComponent;
  let fixture: ComponentFixture<FetchedJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FetchedJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FetchedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
