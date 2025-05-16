import { TestBed } from '@angular/core/testing';

import { ReporteService } from './reporte.service';
describe('ComentarioService', () => {
  let service: ReporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
