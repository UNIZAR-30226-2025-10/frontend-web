import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificacionesService } from '../../services/notificaciones.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-sus-noizzys',
  imports: [RouterModule, CommonModule],
  templateUrl: './sus-noizzys.component.html',
  styleUrls: ['./sus-noizzys.component.css']
})
export class SusNoizzysComponent implements OnInit {
  noizzys: any[] = [];
  nombreUsuario: any = '';
  isModalNoizzitoOpen: boolean = false; // Controla la visibilidad del popup
  isModalCancionOpen: boolean = false; 
  noizzitoSeleccionado: any = null; // Almacena los datos del noizzito seleccionado
  cancionSeleccionadaNoizzito: any = null;
  noizzyContestado: any = '';
  resultadosBusqueda: any[] = [];
  cancionSeleccionada: any = null;
  textoPostNoizzito: string = '';
  idPostNoizzito: string | null = null; 
  busquedaCancion: string = ''; 

  private destroy$ = new Subject<void>();
  constructor(private authService: AuthService,private route: ActivatedRoute, private playerService: PlayerService, private notificacionesService:NotificacionesService,private socketService: SocketService) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.nombreUsuario = params['nombreUsuario']; 
      this.cargarSusNoizzys(this.nombreUsuario);
    });;

    this.socketService.listen('actualizar-noizzy-ws').subscribe((data: any) => {
      if(data.nombreUsuario==this.nombreUsuario){
        this.noizzys.unshift(data);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // Limpia las suscripciones al destruir el componente
  }

  cargarSusNoizzys(nombreUsuario:any): void {
    this.authService.pedirSusNoizzys(nombreUsuario).subscribe({
      next: (response) => {
        this.noizzys = response.noizzys;
      },
      error: (err) => {
        console.error('Error al cargar los Noizzys:', err);
      }
    });
  }

  darLike(like: boolean, idNoizzy: string): void {
    this.authService.likearNoizzy(!like, idNoizzy).subscribe({
      next: (response) => {
        this.cargarSusNoizzys(this.nombreUsuario); 
      },
      error: (err) => {
        console.error('Error al dar like:', err);
      }
    });
  }

  abrirModalNoizzito(idNoizzy: string): void {
    this.isModalNoizzitoOpen = true; // Abre el popup de Noizzito
    this.noizzyContestado = idNoizzy;
    this.resultadosBusqueda = [];
  }
  
  cerrarModalNoizzito(): void {
    this.isModalNoizzitoOpen = false; // Cierra el popup de Noizzito
    this.noizzyContestado = '';
    this.resultadosBusqueda = [];
  }

  abrirModalCancion(): void {
    this.isModalCancionOpen = true;
    this.resultadosBusqueda = [];
  }

  cerrarModalCancion(): void {
    this.isModalCancionOpen = false;
    this.resultadosBusqueda = [];
  }

  publicarNoizzito(): void {
    if (!this.textoPostNoizzito.trim()) {
      alert('El texto del Noizzito no puede estar vacío.');
      return;
    }
  
    const idCancion = this.cancionSeleccionada ? this.cancionSeleccionada.id : null;
  
    this.authService.publicarNoizzito(this.textoPostNoizzito, idCancion, this.noizzyContestado).subscribe({
      next: (response) => {
        this.textoPostNoizzito = '';
        this.idPostNoizzito = null;
        this.cancionSeleccionada = null; // Limpia la canción seleccionada
        this.cargarSusNoizzys(this.nombreUsuario);
        this.cerrarModalNoizzito();
      },
      error: (err) => {
        console.error('Error al publicar el Noizzito:', err);
      }
    });
  }


  onTextoNoizzitoInput(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    this.textoPostNoizzito = inputElement.value; 
  }

  onBusquedaCancionInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const textoBusqueda = inputElement.value.trim();
  
    if (textoBusqueda.length === 0) {
      this.resultadosBusqueda = []; // Limpia los resultados si no hay texto
      return;
    }
  
    this.authService.buscadorNoizzy(textoBusqueda).subscribe({
      next: (response) => {
        this.resultadosBusqueda = response.canciones || []; // Actualiza los resultados con las canciones coincidentes
      },
      error: (err) => {
        console.error('Error al buscar canciones:', err);
      }
    });
  }

  buscarCancion(): void {
    if (!this.busquedaCancion.trim()) {
      alert('Por favor, introduce un término de búsqueda.');
      return;
    }

    this.authService.buscador(this.busquedaCancion).subscribe({
      next: (response) => {
        this.resultadosBusqueda = response.canciones || [];
      },
      error: (err) => {
        console.error('Error al buscar canciones:', err);
      }
    });
  }

  seleccionarCancionNoizzito(cancion: any): void {
    this.cancionSeleccionadaNoizzito = cancion; // Guarda la canción seleccionada
    this.cerrarModalCancion(); // Cierra el popup de búsqueda
  }
  
  eliminarCancionSeleccionadaNoizzito(): void {
    this.cancionSeleccionadaNoizzito = null; // Elimina la canción seleccionada
  }

  eliminarCancionSeleccionada(): void {
    this.cancionSeleccionada = null; // Elimina la canción seleccionada
    this.resultadosBusqueda = []; // Limpia el historial de canciones buscadas
    this.busquedaCancion = ''; // Limpia el texto del campo de búsqueda
  }

  seleccionarCancion(cancion: any): void {
    this.cancionSeleccionada = cancion; // Guarda la canción seleccionada
    this.cerrarModalCancion(); // Cierra el popup de búsqueda
  }

  playSong(cancion: any) {
    this.playerService.setTrack(cancion); // Cambia la canción actual
  }
}