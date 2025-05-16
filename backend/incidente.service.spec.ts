import { TestBed } from '@angular/core/testing';

import { IncidenteService } from './incidente.service';

describe('IncidenteService', () => {
  let service: IncidenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
