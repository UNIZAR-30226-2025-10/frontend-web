import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LimpiarBuscadorService {
  private limpiarBuscador = new BehaviorSubject<any>(null);
  limpiarBuscador$ = this.limpiarBuscador.asObservable();

  setBuscador(data: any) {
    console.log('Valor emitido para limpiar el buscador:', data);
    this.limpiarBuscador.next(data);
  }
}

