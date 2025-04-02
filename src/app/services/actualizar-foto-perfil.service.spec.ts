import { TestBed } from '@angular/core/testing';

import { ActualizarFotoPerfilService } from './actualizar-foto-perfil.service';

describe('ActualizarFotoPerfilService', () => {
  let service: ActualizarFotoPerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualizarFotoPerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
