import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificacionesService } from '../../services/notificaciones.service';
import { NotificationService } from '../../services/notification.service';



@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent {
  misInvitaciones: any[] = [];
  nuevosSeguidores: any[] = [];
  interacciones: any[] = [];
  nuevaMusica: any[] = [];


  hayInvitaciones = false;
  hayInteracciones = false;
  hayNovedades = false;
  hayNuevosSeguidores = false;

  filtroActivo: string = 'invitaciones';

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router,private route: ActivatedRoute,private notificacionesService:NotificacionesService, private notificationService: NotificationService){}

  ngOnInit(): void {
    this.pedirInvitaciones();

    this.notificacionesService.nuevaInvitacion$.subscribe(nuevaInvitacion => {
      this.misInvitaciones.unshift(nuevaInvitacion);
      this.hayInvitaciones = true;
    });

    this.notificacionesService.nuevaInteraccion$.subscribe(nuevaInteraccion => {
      this.interacciones.unshift(nuevaInteraccion);
      this.hayInteracciones = true;
    });

    this.notificacionesService.nuevaNovedad$.subscribe(nuevaNovedad => {
      this.nuevaMusica.unshift(nuevaNovedad);
      this.hayNovedades = true;
    });

    this.notificacionesService.nuevoSeguidor$.subscribe(nuevoSeguidor => {
      this.nuevosSeguidores.unshift(nuevoSeguidor);
      this.hayNuevosSeguidores = true;
    });

    this.notificacionesService.invitaciones$.subscribe(
      tiene => this.hayInvitaciones = tiene
    );
    this.notificacionesService.novedadesMusicales$.subscribe(
      tiene => this.hayNovedades = tiene
    );
    this.notificacionesService.interacciones$.subscribe(
      tiene => this.hayInteracciones = tiene
    );
    this.notificacionesService.seguidores$.subscribe(
      tiene => this.hayNuevosSeguidores = tiene
    );
  }


  cargarNotificaciones(filtro: string): void {    
    switch(filtro) {
      case 'invitaciones':
        this.pedirInvitaciones();
        break;
      case 'nuevaMusica':
        this.pedirNuevaMusica();
        break;
      case 'interacciones':
        this.pedirInteracciones();
        break;
      case 'nuevosSeguidores':
        this.pedirNuevosSeguidores();
        break;
    }
  }

  pedirInvitaciones(): void {
    this.authService.pedirInvitaciones()
      .subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);   
          this.misInvitaciones = response.invitaciones || [];
          console.log('misInvitaciones actualizado:', this.misInvitaciones);
        },
        error: (error) => {
          console.error("Error al obtener las invitaciones:", error);
          // No esta logeado
          if (error.status === 401) {
            this.tokenService.clearStorage();
            this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); 
          }
        },
        complete: () => {
          console.log("Invitaciones recuperadas con éxito");
          this.notificacionesService.setCategoriaLeida('invitaciones');
        }
      });
  }

  aceptarInvitacion(playlistId: string): void {
    this.authService.aceptarInvitacion(playlistId)
    .subscribe({
      next: (response) => {   
        this.misInvitaciones = this.misInvitaciones.filter(invitacion => invitacion.id !== playlistId);
      },
      error: (error) => {
        console.error("Error al aceptar la invitación", error);
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      },
      complete: () => {
        console.log("Invitación aceptada con éxito");
      }
    });
  }

  rechazarInvitacion(playlistId: string): void {
    this.authService.rechazarInvitacion(playlistId)
    .subscribe({
      next: (response) => {   
        this.misInvitaciones = this.misInvitaciones.filter(invitacion => invitacion.id !== playlistId);
      },
      error: (error) => {
        console.error("Error al rechazar la invitación", error);
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      },
      complete: () => {
        console.log("Invitación rechazada con éxito");
      }
    });
  }

  pedirNuevaMusica(): void {
    this.authService.pedirNovedadesMusicales()
      .subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);   
          this.nuevaMusica = response.resultado || [];
        },
        error: (error) => {
          console.error("Error al obtener las novedades musicales:", error);
          // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
        },
        complete: () => {
          console.log("Novedades recuperadas con éxito");
          this.notificacionesService.setCategoriaLeida('novedades');
        }
      });
  }

  verNovedades(novedad:any): void {
    this.irAlbum(novedad.id);
    if (novedad.tipo === 'cancion') {
      this.QuitarNovedadesCancion(novedad.id);
    } else if (novedad.tipo === 'album') {
      this.QuitarNovedadesAlbum(novedad.id);
    }
  }

  QuitarNovedadesCancion(id:any):void{
    this.authService.quitarNovedadesCancion(id)
      .subscribe({
        next: (response) => {
          this.nuevaMusica = this.nuevaMusica.filter(novedad => novedad.id !== id);
        },
        error: (error) => {
          console.error("Error al quitar las novedades", error);
          // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
        },
        complete: () => {
          console.log("Novedades eliminadas con éxito");
        }
      });
  }

  QuitarNovedadesAlbum(id:any):void{
    this.authService.quitarNovedadesAlbum(id)
      .subscribe({
        next: (response) => {
          this.nuevaMusica = this.nuevaMusica.filter(novedad => novedad.id !== id);
        },
        error: (error) => {
          console.error("Error al quitar las novedades", error);
          // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
        },
        complete: () => {
          console.log("Novedades eliminadas con éxito");
        }
      });
  }

  pedirInteracciones(): void {
    this.authService.pedirInteracciones()
      .subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);   
          this.interacciones = response || [];
        },
        error: (error) => {
          console.error("Error al obtener las interacciones:", error);
          // No esta logeado
          if (error.status === 401) {
            this.tokenService.clearStorage();
            this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); 
          }
        },
        complete: () => {
          console.log("Interacciones recuperadas con éxito");
          this.notificacionesService.setCategoriaLeida('interacciones');
        }
      });
  }

  verInteraccion(id: string): void {
    this.irNoizzy(id);
    this.InteraccionesLeidas(id);
  }
  

  InteraccionesLeidas(id:any):void{
    this.authService.quitarInteracciones(id)
      .subscribe({
        next: () => {
          this.interacciones = this.interacciones.filter(interaccion => interaccion.noizzy !== id);
        },
        error: (error) => {
          console.error("Error al quitar las interacciones", error);
          // No esta logeado
          if (error.status === 401) {
            this.tokenService.clearStorage();
            this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); 
          }
        },
        complete: () => {
          console.log("Interacciones eliminadas con éxito");
        }
      });
  }

  pedirNuevosSeguidores(): void {
    this.authService.pedirNuevosSeguidores()
      .subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);   
          this.nuevosSeguidores = response.resultado || [];
          console.log('mis seguidores actualizado:', this.misInvitaciones);
        },
        error: (error) => {
          console.error("Error al obtener los seguidores:", error);
          // No esta logeado
          if (error.status === 401) {
            this.tokenService.clearStorage();
            this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); 
          }
        },
        complete: () => {
          console.log("Seguidores recuperados con éxito");
          this.notificacionesService.setCategoriaLeida('seguidores');
        }
      });
  }

  verSeguidor(seguidor:any): void {
    if(seguidor.tipo === 'artista'){
      this.irPerfilArtista(seguidor.nombreUsuario);
    } else{
      this.irPerfil(seguidor.nombreUsuario);
    }
    this.quitarNuevoSeguidor(seguidor.nombreUsuario);
  }

  quitarNuevoSeguidor(nombreUsuario:string): void {
    this.authService.quitarNuevoSeguidor(nombreUsuario)
      .subscribe({
        next: () => {
          this.nuevosSeguidores = this.nuevosSeguidores.filter(seguido => seguido.nombreUsuario !== nombreUsuario);
        },
        error: (error) => {
          console.error("Error al quitar la notificacion:", error);
          // No esta logeado
          if (error.status === 401) {
            this.tokenService.clearStorage();
            this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); 
          }
        },
        complete: () => {
          console.log("Notificacion quitada con éxito");
        }
      });
  }

  cambiarFiltro(filtro: string) {
    if (this.filtroActivo !== filtro) {
      this.filtroActivo = filtro;
      this.cargarNotificaciones(filtro);
    }
  }

  onScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop; 
    const filtros = document.querySelector('.filtros'); 
    
    if (filtros) {
      if (scrollTop > 10) {
          filtros.classList.add('scrolled'); 
      } else {
          filtros.classList.remove('scrolled'); 
      }
    }
  }

  irAlbum(id: string) {
    this.router.navigate(['/home/album', id]);
  }

  irPerfil(id: string) {
    this.router.navigate(['/home/perfil', id]);
  }

  irPerfilArtista(id: string) {
    this.router.navigate(['/home/artista', id]);
  }

  irNoizzy(id: string) {
    //this.router.navigate(['/home/noizzy', id]);
  }

  seguirUsuario(id:any) {
    this.authService.changeFollow(id, true)
    .subscribe({
      next: () => {   
      this.nuevosSeguidores = this.nuevosSeguidores.filter(seguido => seguido.id !== id);
      },
      error: (error) => {
        console.error('Error al seguir', error);
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      },
      complete: () => {
        console.log('Cambio completado con éxito');
      }
    });
  }
  
}
