import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private hayInteracciones = false;
  private hayNovedades = false;
  private haySeguidores = false;
  private hayInvitaciones = false;

  // BehaviorSubjects para las categorías específicas
  private invitacionesSubject = new BehaviorSubject<boolean>(false);
  private novedadesMusicalesSubject = new BehaviorSubject<boolean>(false);
  private interaccionesSubject = new BehaviorSubject<boolean>(false);
  private seguidoresSubject = new BehaviorSubject<boolean>(false);

  // Observables para los BehaviorSubjects (desde el buscador)
  invitaciones$ = this.invitacionesSubject.asObservable();
  novedadesMusicales$ = this.novedadesMusicalesSubject.asObservable();
  interacciones$ = this.interaccionesSubject.asObservable();
  seguidores$ = this.seguidoresSubject.asObservable();

  // Estado global de notificaciones
  private hayNotificacionesSubject = new BehaviorSubject<boolean>(true);
  hayNotificaciones$ = this.hayNotificacionesSubject.asObservable();

  // Para notificaciones en tiempo real por socket
  private nuevaInvitacionSource = new Subject<any>();
  private nuevaInteraccionSource = new Subject<any>();
  private nuevaNovedadSource = new Subject<any>();
  private nuevoSeguidorSource = new Subject<any>();

  // Observables para eventos en tiempo real
  nuevaInvitacion$ = this.nuevaInvitacionSource.asObservable();
  nuevaInteraccion$ = this.nuevaInteraccionSource.asObservable();
  nuevaNovedad$ = this.nuevaNovedadSource.asObservable();
  nuevoSeguidor$ = this.nuevoSeguidorSource.asObservable();

  // Notificaciones en tiempo real
  notificarNuevaInvitacion(invitacion: any) {
    this.nuevaInvitacionSource.next(invitacion);
    this.hayInvitaciones = true;
    this.invitacionesSubject.next(true);
    this.actualizarNotificacionGlobal();
  }

  notificarNuevaNovedad(novedad: any) {
    this.nuevaNovedadSource.next(novedad);
    this.hayNovedades = true;
    this.novedadesMusicalesSubject.next(true);
    this.actualizarNotificacionGlobal();
  }

  notificarNuevaInteraccion(interaccion: any) {
    this.nuevaInteraccionSource.next(interaccion);
    this.hayInteracciones = true;
    this.interaccionesSubject.next(true);
    this.actualizarNotificacionGlobal();
  }

  notificarNuevoSeguidor(seguidor: any) {
    this.nuevoSeguidorSource.next(seguidor);
    this.haySeguidores = true;
    this.seguidoresSubject.next(true);
    this.actualizarNotificacionGlobal();
  }

  // Marcar categorías como leídas
  setCategoriaLeida(categoria: 'interacciones' | 'novedades' | 'seguidores' | 'invitaciones') {
    if (categoria === 'interacciones') {
      this.hayInteracciones = false;
      this.interaccionesSubject.next(false);
    }
    if (categoria === 'novedades') {
      this.hayNovedades = false;
      this.novedadesMusicalesSubject.next(false);
    }
    if (categoria === 'seguidores') {
      this.haySeguidores = false;
      this.seguidoresSubject.next(false);
    }
    if (categoria === 'invitaciones') {
      this.hayInvitaciones = false;
      this.invitacionesSubject.next(false);
    }
    
    this.actualizarNotificacionGlobal();
  }

  // Actualizar notificación global
  private actualizarNotificacionGlobal() {
    const hayAlgo = this.hayInteracciones || this.hayNovedades || this.haySeguidores || this.hayInvitaciones;
    this.hayNotificacionesSubject.next(hayAlgo);
  }

  // Actualizar el estado de notificaciones desde pedirNotificaciones del buscador
  actualizarNotificaciones(invitaciones: boolean, novedadesMusicales: boolean, 
                          interacciones: boolean, seguidores: boolean) {
    this.hayInvitaciones = invitaciones;
    this.hayNovedades = novedadesMusicales;
    this.hayInteracciones = interacciones;
    this.haySeguidores = seguidores;
    
    this.invitacionesSubject.next(invitaciones);
    this.novedadesMusicalesSubject.next(novedadesMusicales);
    this.interaccionesSubject.next(interacciones);
    this.seguidoresSubject.next(seguidores);
    
    this.actualizarNotificacionGlobal();

    console.log('Estado de notificaciones actualizado:', 
      this.hayInvitaciones, this.hayNovedades,
      this.hayInteracciones, this.haySeguidores);
  }
}