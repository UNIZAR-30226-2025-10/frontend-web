import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Router, RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    this.tokenService.clearStorage();
    this.router.navigate(['/login']);
  }

  registerOyente(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-oyente`, credentials);
  }
}
