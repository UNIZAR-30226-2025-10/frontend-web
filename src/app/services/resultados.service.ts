import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  private resultados = new BehaviorSubject<any>(null);
  resultados$ = this.resultados.asObservable();

  setResultados(data: any) {
    this.resultados.next(data);
  }
}
