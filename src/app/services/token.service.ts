import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenKey = 'accessToken'; // Clave para el localStorage
  private userKey = 'userData';
  private tipoKey = 'tipoData';

  constructor() { }

  // Guardar token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  setTipo(tipo: any): void {
    localStorage.setItem(this.tipoKey, JSON.stringify(tipo));
  }

  getTipo(): any {
    const tipoData = localStorage.getItem(this.tipoKey);
    return tipoData ? JSON.parse(tipoData) : null;
  }


  // Eliminar token (Logout)
  clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tipoKey);
  }


  clearTemporalToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}
