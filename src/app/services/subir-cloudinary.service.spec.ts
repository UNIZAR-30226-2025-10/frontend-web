import { TestBed } from '@angular/core/testing';

import { SubirCloudinaryService } from './subir-cloudinary.service';

describe('SubirCloudinaryService', () => {
  let service: SubirCloudinaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubirCloudinaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
