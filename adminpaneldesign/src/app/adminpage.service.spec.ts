import { TestBed } from '@angular/core/testing';

import { AdminpageService } from './adminpage.service';

describe('AdminpageService', () => {
  let service: AdminpageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminpageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
