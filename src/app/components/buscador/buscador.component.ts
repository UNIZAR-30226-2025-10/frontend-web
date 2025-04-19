import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { ResultadosService } from '../../services/resultados.service';
import { LimpiarBuscadorService } from '../../services/limpiar-buscador.service';  // Ajusta la ruta según corresponda
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { TokenService } from '../../services/token.service';
import { ActualizarFotoPerfilService } from '../../services/actualizar-foto-perfil.service';
import { SocketService } from '../../services/socket.service';
import { ThemeService } from '../../services/theme.service';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NotificacionesService } from '../../services/notificaciones.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class BuscadorComponent implements OnInit, OnDestroy{
  searchQuery: string = '';
  sidebarOpen = false;
  previousUrl: string = '';
  foto: string = '';

  tieneNotificaciones: boolean=false;
  estaEnPaginaNotificaciones = false;

  private searchQuerySubject: Subject<string> = new Subject(); 
  private subscription!: Subscription;
  private fotoSubscription!: Subscription;

  tieneInvitaciones: boolean = false;
  tieneNovedadesMusicales: boolean = false;
  tieneInteracciones: boolean = false;
  tieneSeguidores: boolean = false;
  

  @Output() searchResults = new EventEmitter<any>(); // Emitirá los resultados al componente padre

  constructor(private router: Router, private sidebarService: SidebarService, private resultadosService: ResultadosService, private limpiarBuscadorService: LimpiarBuscadorService, private authService: AuthService, private tokenService: TokenService,  private actFotoService: ActualizarFotoPerfilService,private socketService: SocketService,private themeService: ThemeService,private notificacionesService: NotificacionesService, private notificationService: NotificationService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Comprobar si está en la página de notificaciones
      this.estaEnPaginaNotificaciones = event.url.includes('/notificaciones');
    });
  }


  ngOnInit() {

    this.previousUrl = this.router.url;
    this.foto = this.tokenService.getUser().fotoPerfil;

    this.pedirNotificaciones();

    this.subscription = this.limpiarBuscadorService.limpiarBuscador$.subscribe(data => {
      if (data === true) {
        // Aquí puedes limpiar el campo de búsqueda, por ejemplo
        this.searchQuery = '';  // Limpiar el input de búsqueda
      }
    });

      // Nos suscribimos al observable para recibir la nueva foto de perfil instantáneamente
      this.fotoSubscription = this.actFotoService.actualizarFoto$
      .subscribe(fotoData => {
        if (fotoData) {
          if (fotoData.actualizarFoto) {
            console.log('dentro evento actualizar foto', fotoData);
            this.foto = this.tokenService.getUser().fotoPerfil;
          }
        }
      });

   
    this.searchQuerySubject.pipe(
      debounceTime(500),  
      switchMap(query => {
        return this.authService.buscador(query);
      }),
      catchError(error => {
        console.error('Error al obtener los datos', error);
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
        
        return [];
      })
    ).subscribe({
      next: (data) => {

        this.searchResults.emit(data); // Emitimos los resultados al componente padre

        // Guardamos los resultados en el servicio antes de navegar
        this.resultadosService.setResultados(data);

        // Si hay resultados, navegamos a la nueva ruta
        this.router.navigate(['/home/resultados'], { queryParams: { search: this.searchQuery } });
      },
      error: (error) => {
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
        console.error('Error al obtener los datos', error);
      }
    });

    this.notificacionesService.hayNotificaciones$.subscribe(hay => {
      this.tieneNotificaciones = hay;
    });

    this.socketService.connect();

    this.socketService.listen('invite-to-playlist-ws').subscribe((data) => {
      console.log('Nueva invitación recibida:', data);
      this.tieneNotificaciones = true;

      if (this.estaEnPaginaNotificaciones) {
        this.notificarNuevaInvitacion(data);
      }
    });

    this.socketService.listen('novedad-musical-ws').subscribe((data) => {
      console.log('Nueva novedad musical recibida:', data);
      this.tieneNotificaciones = true;

      if (this.estaEnPaginaNotificaciones) {
        this.notificarNuevaNovedad(data);
      }
    });

    // Respuesta o like a noizzy
    this.socketService.listen('nueva-interaccion-ws').subscribe((data) => {
      console.log('Nueva interaccion recibida:', data);
      this.tieneNotificaciones = true;

      if (this.estaEnPaginaNotificaciones) {
        this.notificarNuevaInteraccion(data);
      }
    });

    this.socketService.listen('nuevo-seguidor-ws').subscribe((data) => {
      console.log('Nuevo seguidor recibido:', data);
      this.tieneNotificaciones = true;

      if (this.estaEnPaginaNotificaciones) {
        this.notificarNuevoSeguidor(data);
      }
    });
  }

  ngOnDestroy(): void {
    // Nos desuscribimos para evitar pérdidas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.searchQuerySubject.unsubscribe();
  } 

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarService.toggleSidebar();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goPerfil() {
    if (this.tokenService.getTipo() === "artista") {
      this.router.navigate(['/home/miPerfilArtista']);  
    }else {
      this.router.navigate(['/home/miPerfilOyente']);
    }
  }

  onSearchInputChange() {
    // Emitimos el valor de búsqueda cuando cambia el input
    this.searchQuerySubject.next(this.searchQuery);
  }


  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  notificarNuevaInvitacion(data: any): void {
    this.notificacionesService.notificarNuevaInvitacion(data);
  }

  notificarNuevaInteraccion(data: any): void {
    this.notificacionesService.notificarNuevaInteraccion(data);
  }

  notificarNuevaNovedad(data: any): void {
    this.notificacionesService.notificarNuevaNovedad(data);
  }

  notificarNuevoSeguidor(data: any): void {
    this.notificacionesService.notificarNuevoSeguidor(data);
  }

  pedirNotificaciones() {
    this.authService.pedirNotificaciones()
    .subscribe({
      next: (response) => {   
        this.tieneInvitaciones = response.invitaciones;
        this.tieneNovedadesMusicales = response.novedadesMusicales;
        this.tieneInteracciones = response.interacciones;
        this.tieneSeguidores = response.seguidores;
        
        this.tieneNotificaciones = 
          this.tieneInvitaciones || 
          this.tieneNovedadesMusicales || 
          this.tieneInteracciones || 
          this.tieneSeguidores;
        console.log('Notificaciones recibidas:', response);

        this.notificacionesService.actualizarNotificaciones(
          response.invitaciones,
          response.novedadesMusicales,
          response.interacciones,
          response.seguidores
        );
      },
      error: (error) => {
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
        console.error('Error al pedir las notificaciones', error);
      },
      complete: () => {
        console.log('Notificaciones recuperadas con éxito');
      }
    });
  }
}

