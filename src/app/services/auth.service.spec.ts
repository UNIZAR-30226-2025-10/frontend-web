import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken', 'getTempToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController); 
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return error if no token is found on logout', () => {
    tokenServiceSpy.getToken.and.returnValue(null);

    service.logout().subscribe(response => {
      expect(response).toEqual({ error: 'No autorizado' });
    });
  });

  it('should call HTTP POST on login', () => {
    const mockCredentials = { email: 'test@example.com', password: '123456' };
    const mockResponse = { success: true };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

 
    const req = httpMock.expectOne('http://api-noizz.onrender.com');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);

    req.flush(mockResponse); 
  });
});
