import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';




@Component({
  selector: 'app-estadisticas-cancion',
  imports: [CommonModule, RouterModule],
  templateUrl: './estadisticas-cancion.component.html',
  styleUrl: './estadisticas-cancion.component.css'
})
export class EstadisticasCancionComponent implements OnInit{

  currentIdCancion: string = '';
  cancion: any = {};
  verPlaylists: boolean=false;
  verMeGustas: boolean=false;
  eliminarModalIsOpen:boolean = false;
  router: any;
  tokenService: any;

  constructor(private authService: AuthService, private route: ActivatedRoute, private location: Location,private notificationService: NotificationService) {}

  usuarios : any[] = [];
  playlists: any[] = []; 
  privadas: number = 0;

  ngOnInit(): void {

    const idCancion = this.route.snapshot.paramMap.get('id'); 
    if (idCancion) {
      this.currentIdCancion = idCancion;
    }

    this.authService.pedirEstadisticasCancion(this.currentIdCancion)
    .subscribe({
      next: (response) => {   
        this.cancion = response.cancion;

        //Ajustar duración
        this.cancion.minutos = Math.floor(response.cancion.duracion / 60);
        const segundosRestantes = response.cancion.duracion % 60;
        this.cancion.segundos = segundosRestantes.toString().padStart(2, "0");

        //Ajustar formato de la fecha
        this.cancion.fechaPublicacion = this.formatearFecha(response.cancion.fechaPublicacion);

      },
      error: (error) => {
        console.error("Error al recibir los datos de la cancion:", error);
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
        console.log("Datos de la cancion recibidos con éxito");
      }
    });

  }

  formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(fecha);
  }

  abrirComprobacionEliminar() {
    this.eliminarModalIsOpen = true;
  }

  cerrarComprobacionEliminar() {
    this.eliminarModalIsOpen = false;
  }

  abrirMeGustas() {
    if (this.usuarios.length === 0) {
      this.authService.pedirMeGustasCancion(this.currentIdCancion)
      .subscribe({
        next: (response) => { 
          this.usuarios = response.oyentes_favs;
          this.verMeGustas=true;
        },
        error: (error) => {
          console.error("Error al recibir los perfiles que han dado me gusta a la cancion:", error);
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
          console.log("Perfiles recibidos con éxito");
        }
      });
    } else {
      this.verMeGustas=true;
    }
  }

  cerrarMeGustas() {
    this.verMeGustas=false;
  }

  abrirPlaylists() {
    if (this.playlists.length === 0) {
      this.authService.pedirPlaylistsContienenCancion(this.currentIdCancion)
      .subscribe({
        next: (response) => { 
          this.playlists = response.playlists_publicas;
          this.privadas = response.n_privadas;
          this.verPlaylists=true;
        },
        error: (error) => {
          console.error("Error al recibir las playlists donde está la cancion:", error);
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
          console.log("Playlists recibidas con éxito");
        }
      });
    } else {
      this.verPlaylists=true;
    }
  }

  cerrarPlaylists() {
    this.verPlaylists=false;
  }

  eliminarCancion() {

    this.authService.eliminarCancion(this.currentIdCancion)
    .subscribe({
      next: () => {   
        this.eliminarModalIsOpen = false;
        this.location.back();
      },
      error: (error) => {
        console.error("Error al eliminar la canción:", error);
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
        console.log("Canción eliminada con éxito");
      }
    });

  }
  
}
