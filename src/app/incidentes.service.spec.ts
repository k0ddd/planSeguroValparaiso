import { TestBed } from '@angular/core/testing';

import { IncidentesService } from './incidentes.service';

describe('IncidentesService', () => {
  let service: IncidentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
