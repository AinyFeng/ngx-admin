import { TestBed } from '@angular/core/testing';

import { ScimService } from './scim.service';

describe('ScimService', () => {
  let service: ScimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
