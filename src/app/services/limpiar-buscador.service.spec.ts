import { TestBed } from '@angular/core/testing';

import { LimpiarBuscadorService } from './limpiar-buscador.service';

describe('LimpiarBuscadorService', () => {
  let service: LimpiarBuscadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LimpiarBuscadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
