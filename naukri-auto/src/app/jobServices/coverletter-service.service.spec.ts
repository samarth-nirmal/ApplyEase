import { TestBed } from '@angular/core/testing';

import { CoverletterServiceService } from './coverletter-service.service';

describe('CoverletterServiceService', () => {
  let service: CoverletterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverletterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
