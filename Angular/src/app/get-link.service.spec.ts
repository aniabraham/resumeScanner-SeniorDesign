import { TestBed, inject } from '@angular/core/testing';

import { GetLinkService } from './get-link.service';

describe('GetLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetLinkService]
    });
  });

  it('should be created', inject([GetLinkService], (service: GetLinkService) => {
    expect(service).toBeTruthy();
  }));
});
