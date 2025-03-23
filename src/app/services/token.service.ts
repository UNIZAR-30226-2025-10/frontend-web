import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenKey = 'accessToken'; // Clave para el localStorage
  private userKey = 'userData';
  private tipoKey = 'tipoData';
  private tokenTempKey = 'tempToken';
  private cancionActual = 'cancionActual';
  private coleccionActual = 'coleccionActual';
  private progreso = 'progreso';

  constructor() { }

  // Guardar token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setTempToken(tempToken: string): void {
    localStorage.setItem(this.tokenTempKey, tempToken);
  }

  getTempToken(): string | null {
    return localStorage.getItem(this.tokenTempKey);
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


  setCancionActual(cancion: any): void {
    localStorage.setItem(this.cancionActual, JSON.stringify(cancion));
  }

  getCancionActual(): any {
    const cancionData = localStorage.getItem(this.cancionActual);
    return cancionData ? JSON.parse(cancionData) : null;
  }

  setColeccionActual(coleccion: any): void {
    localStorage.setItem(this.coleccionActual, JSON.stringify(coleccion));
  }

  getColeccionActual(): any {
    const coleccionData = localStorage.getItem(this.coleccionActual);
    return coleccionData ? JSON.parse(coleccionData) : null;
  }

  setProgresoLocal(progreso: any): void {
    localStorage.setItem(this.progreso, JSON.stringify(progreso));
  }

  getProgresoLocal(): any {
    const progresoData = localStorage.getItem(this.progreso);
    return progresoData ? JSON.parse(progresoData) : null;
  }





  // Eliminar token (Logout)
  clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tipoKey);
    localStorage.removeItem(this.cancionActual);
    localStorage.removeItem(this.coleccionActual);
    localStorage.removeItem(this.progreso);
  }


  clearTemporalToken(): void {
    localStorage.removeItem(this.tokenTempKey);
  }

  // Verificar si el usuario está autenticado
  isAuthenticatedAndOyente(): boolean {
    return !!this.getToken() && this.getTipo()=="oyente";
  }

  isAuthenticatedAndArtista(): boolean {
    return !!this.getToken() && this.getTipo()=="artista";
  }

  isAuthenticatedAndPendiente(): boolean {
    return !!this.getToken() && this.getTipo()=="pendiente";
  }

  isAuthenticatedAndValido(): boolean {
    return !!this.getToken() && this.getTipo()=="valido";
  }

  hasTempToken(): boolean {
    return !!this.getTempToken();
  }

  setSid(sid: string): void {
    localStorage.setItem('sid', sid);
  }
  
  getSid(): string | null {
    return localStorage.getItem('sid');
  }
  

}
