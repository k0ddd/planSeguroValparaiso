import { TestBed } from '@angular/core/testing';

import { ZonasService } from './zonas.service';

describe('ZonasService', () => {
  let service: ZonasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZonasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
