import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private nuevaInvitacionSource = new Subject<any>();
  nuevaInvitacion$ = this.nuevaInvitacionSource.asObservable();

  notificarNuevaInvitacion(invitacion: any) {
    this.nuevaInvitacionSource.next(invitacion);
  }
}