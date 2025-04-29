import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { NotificationService } from '../../services/notification.service';
import { SocketService } from '../../services/socket.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-mis-noizzys',
  imports: [RouterModule, CommonModule],
  templateUrl: './mis-noizzys.component.html',
  styleUrls: ['./mis-noizzys.component.css']
})
export class MisNoizzysComponent implements OnInit {
  noizzys: any[] = []; 
  textoPostNoizzy: string = ''; 
  idPostNoizzy: string | null = null; 
  isModalNoizzyOpen: boolean = false;
  isModalCancionOpen: boolean = false; 
  busquedaCancion: string = ''; 
  resultadosBusqueda: any[] = [];
  cancionSeleccionada: any = null;
  isModalNoizzitosOpen: boolean[] = [];
  NoizzyNoizzitosArray: any[] = [];
  textoPostNoizzito: string = '';
  idPostNoizzito: string | null = null; 
  isModalNoizzitoOpen: boolean = false; // Controla la visibilidad del popup
  noizzitoSeleccionado: any = null; // Almacena los datos del noizzito seleccionado
  cancionSeleccionadaNoizzito: any = null;
  noizzyContestado: any = '';


  constructor(private authService: AuthService,private tokenService: TokenService,private playerService: PlayerService, private notificationService: NotificationService,private socketService: SocketService,private router: Router) {}

  ngOnInit(): void {
    this.cargarMisNoizzys();

    this.socketService.listen('actualizar-noizzy-ws').subscribe((data) => {
      console.log('Nueva interaccion recibida:', data);
      if(data.mio){
        data.num_comentarios=0;
        data.num_likes=0;
        this.noizzys.unshift(data);
      }
    });
  }

  cargarMisNoizzys(): void {
    this.authService.pedirMisNoizzys().subscribe({
      next: (response) => {
        this.noizzys = response.noizzys; 
      },
      error: (err) => {
        console.error('Error al cargar los Noizzys:', err);
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
        this.cargarMisNoizzys(); 
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
  
  abrirModalNoizzy(): void {
    this.isModalNoizzyOpen = true;
    this.resultadosBusqueda = [];
  }

  cerrarModalNoizzy(): void {
    this.isModalNoizzyOpen = false;
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
  
  publicarNoizzy(): void {
    if (!this.textoPostNoizzy.trim()) {
      alert('El texto del Noizzy no puede estar vacío.');
      return;
    }

    const idCancion = this.cancionSeleccionada ? this.cancionSeleccionada.id : null;

    this.authService.publicarNoizzy(this.textoPostNoizzy, idCancion).subscribe({
      next: (response) => {
        this.textoPostNoizzy = '';
        this.idPostNoizzy = null;
        this.cancionSeleccionada = null; // Limpia la canción seleccionada
        //this.cargarMisNoizzys();
        this.cerrarModalNoizzy();
      },
      error: (err) => {
        console.error('Error al publicar el Noizzy:', err);
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

  publicarNoizzito(): void {
    if (!this.textoPostNoizzito.trim()) {
      alert('El texto del Noizzito no puede estar vacío.');
      return;
    }
  
    const idCancion = this.cancionSeleccionadaNoizzito ? this.cancionSeleccionadaNoizzito.id : null;
  
    this.authService.publicarNoizzito(this.textoPostNoizzito, idCancion, this.noizzyContestado).subscribe({
      next: (response) => {
        this.textoPostNoizzito = '';
        this.idPostNoizzito = null;
        this.cancionSeleccionadaNoizzito = null; // Limpia la canción seleccionada
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

   // Método para manejar el evento de entrada en el campo de texto
  onTextoNoizzyInput(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    this.textoPostNoizzy = inputElement.value; 
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

  eliminarCancionSeleccionada(): void {
    this.cancionSeleccionada = null; // Elimina la canción seleccionada
    this.resultadosBusqueda = []; // Limpia el historial de canciones buscadas
    this.busquedaCancion = ''; // Limpia el texto del campo de búsqueda
  }

  eraseNoizzy(idNoizzy: string): void {
    this.authService.borrarNoizzy(idNoizzy).subscribe({
      next: (response) => {
        this.cargarMisNoizzys(); 
        this.notificationService.showSuccess('Noizzy eliminado');
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

  seleccionarCancionNoizzito(cancion: any): void {
    this.cancionSeleccionadaNoizzito = cancion; // Guarda la canción seleccionada
    this.cerrarModalCancion(); // Cierra el popup de búsqueda
  }
  
  eliminarCancionSeleccionadaNoizzito(): void {
    this.cancionSeleccionadaNoizzito = null; // Elimina la canción seleccionada
  }

  playSong(cancion: any) {
    this.playerService.setTrack(cancion); // Cambia la canción actual
  }
}