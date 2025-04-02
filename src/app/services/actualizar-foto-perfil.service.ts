import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActualizarFotoPerfilService {

  actualizarFotoSource = new BehaviorSubject<{ actualizarFoto: boolean} | null>(null);
  actualizarFoto$ = this.actualizarFotoSource.asObservable();

  constructor() { }

  actualizarFoto() {
    console.log('en actualizarFoto')
    this.actualizarFotoSource.next({ actualizarFoto: true});
  }
}
