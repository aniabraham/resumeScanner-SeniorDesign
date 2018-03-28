import { TestBed, inject } from '@angular/core/testing';

import { GetResumeDataService } from './get-resume-data.service';

describe('GetArticleDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetResumeDataService]
    });
  });

  it('should be created', inject([GetResumeDataService], (service: GetResumeDataService) => {
    expect(service).toBeTruthy();
  }));
});
