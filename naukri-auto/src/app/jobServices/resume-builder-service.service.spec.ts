import { TestBed } from '@angular/core/testing';

import { ResumeBuilderServiceService } from './resume-builder-service.service';

describe('ResumeBuilderServiceService', () => {
  let service: ResumeBuilderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeBuilderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
