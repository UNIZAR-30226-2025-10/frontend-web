import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { Location } from '@angular/common';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-nizzitos',
  imports: [RouterModule, CommonModule],
  templateUrl: './noizzitos.component.html',
  styleUrls: ['./noizzitos.component.css']
})
export class NoizzitosComponent implements OnInit {
    noizzyID: any = '';
    noizzy: any = {};
    noizzitos: any = [];
    isModalNoizzitosOpen: boolean[] = [];
    NoizzyNoizzitosArray: any[] = [];
    textoPostNoizzito: string = '';
    idPostNoizzito: string | null = null; 
    isModalNoizzitoOpen: boolean = false; // Controla la visibilidad del popup
    noizzitoSeleccionado: any = null; // Almacena los datos del noizzito seleccionado
    cancionSeleccionadaNoizzito: any = null;
    noizzyContestado: any = '';
    isModalCancionOpen: boolean = false; 
    busquedaCancion: string = ''; 
    resultadosBusqueda: any[] = [];
    cancionSeleccionada: any = null;
    user: any = null;

    private destroy$ = new Subject<void>();
    constructor(private authService: AuthService,  private router: Router,private tokenService: TokenService, private route: ActivatedRoute, private playerService: PlayerService,private notificationService: NotificationService,  private location: Location, private socketService: SocketService) {}

    ngOnInit(): void {
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        this.user = this.tokenService.getUser();
        this.noizzyID = params['id']; 
        this.isModalNoizzitoOpen = false;
        this.isModalCancionOpen = false;
        this.cargarDatosNoizzy(); 
      });

      
      this.socketService.listen('actualizar-noizzito-ws').subscribe((data) => {
        console.log('Nueva interaccion recibida:', data);
        if(this.noizzyID==data.noizzy){
          data.num_comentarios=0;
          data.num_likes=0;
          this.noizzitos.unshift(data);
        }
      });
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete(); // Limpia las suscripciones al destruir el componente
    }

    cargarDatosNoizzy() {
        this.authService.pedirDatosNoizzys(this.noizzyID).subscribe({
            next: (response) => {
                console.log(response)
                this.noizzy = response;
                this.noizzitos = this.noizzy.noizzitos;
            },
            error: (err) => {
                console.error('Error al cargar el Noizzy:', err);
                // No esta logeado
                if (err.status === 401) {
                  this.tokenService.clearStorage();
                  this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
                  setTimeout(() => {
                    this.router.navigate(['/login']);
                  }, 3000); 
                }
            }
        });
    }

    darLike(like: any, idNoizzy: any): void {
        this.authService.likearNoizzy(!like, idNoizzy).subscribe({
          next: (response) => {
            this.cargarDatosNoizzy(); 
          },
          error: (err) => {
            console.error('Error al dar like:', err);
            // No esta logeado
            if (err.status === 401) {
              this.tokenService.clearStorage();
              this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 3000); 
            }
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
      
        console.log("Texto: ", (this.textoPostNoizzito));
        console.log("Id cancion: ", (idCancion));
        console.log("Id contestado: ", (this.noizzyContestado));
        this.authService.publicarNoizzito(this.textoPostNoizzito, idCancion, this.noizzyContestado).subscribe({
          next: (response) => {
            this.textoPostNoizzito = '';
            this.idPostNoizzito = null;
            this.cancionSeleccionadaNoizzito = null; // Limpia la canción seleccionada
            this.cargarDatosNoizzy();
            this.cerrarModalNoizzito();
          },
          error: (err) => {
            console.error('Error al publicar el Noizzito:', err);
            // No esta logeado
            if (err.status === 401) {
              this.tokenService.clearStorage();
              this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 3000); 
            }
          }
        });
    }

    onTextoNoizzitoInput(event: Event): void {
        const inputElement = event.target as HTMLTextAreaElement;
        this.textoPostNoizzito = inputElement.value; 
    }

    abrirCerrarModalNoizzitos(noizzy: any): void {
        if (this.isModalNoizzitosOpen[noizzy] == true) {
          this.isModalNoizzitosOpen[noizzy] = false;
        }
        else {
          this.isModalNoizzitosOpen[noizzy] = true;
          this.authService.pedirDatosNoizzys(noizzy).subscribe({
            next: (response) => {
              this.NoizzyNoizzitosArray[noizzy] = response.noizzitos || [];
            },
            error: (err) => {
              console.error('Error al buscar canciones:', err);
              // No esta logeado
              if (err.status === 401) {
                this.tokenService.clearStorage();
                this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 3000); 
              }
            }
          });
        }
    }

    seleccionarCancionNoizzito(cancion: any): void {
        this.cancionSeleccionadaNoizzito = cancion; // Guarda la canción seleccionada
        this.cerrarModalCancion(); // Cierra el popup de búsqueda
    }
      
    eliminarCancionSeleccionadaNoizzito(): void {
        this.cancionSeleccionadaNoizzito = null; // Elimina la canción seleccionada
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
            // No esta logeado
            if (err.status === 401) {
              this.tokenService.clearStorage();
              this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 3000); 
            }
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
            // No esta logeado
            if (err.status === 401) {
              this.tokenService.clearStorage();
              this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 3000); 
        }
          }
        });
    }
    
    seleccionarCancion(cancion: any): void {
        this.cancionSeleccionada = cancion; // Guarda la canción seleccionada
        this.cerrarModalCancion(); // Cierra el popup de búsqueda
    }

    eliminarCancionSeleccionada(): void {
        this.cancionSeleccionada = null; // Elimina la canción seleccionada
        this.resultadosBusqueda = []; // Limpia el historial de canciones buscadas
        this.busquedaCancion = ''; // Limpia el texto del campo de búsqueda
    }

    playSong(cancion: any) {
      this.playerService.setTrack(cancion); // Cambia la canción actual
    }

    eraseNoizzy(idNoizzy: string,volver:boolean): void {
      this.authService.borrarNoizzy(idNoizzy).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Noizzy eliminado');
          if(volver){
            this.location.back();
          }else{
            this.cargarDatosNoizzy(); 
          }
        },
        error: (err) => {
          console.error('Error al eliminar el Noizzy:', err);
          // No esta logeado
          if (err.status === 401) {
            this.tokenService.clearStorage();
            this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); 
          }
        }
      });
    }
}