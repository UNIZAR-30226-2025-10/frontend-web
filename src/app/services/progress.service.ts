import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private progressSubject = new BehaviorSubject<number>(0); // Inicializa en 0, puedes poner el valor inicial de la canción
  public progress$ = this.progressSubject.asObservable();

  constructor(private tokenService: TokenService) { }

  // Establece el progreso de la canción
  setProgress(progress: number): void {
    this.progressSubject.next(progress);
    this.tokenService.setProgresoLocal(progress);
  }

  // Obtiene el progreso de la canción
  getProgress(): number {
    return this.progressSubject.value;
  }
}
