import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { ProgressService } from '../../services/progress.service';
import { switchMap } from 'rxjs/operators';


interface misDatos {
  nombre: string;
  nSeguidores: number;
  nSeguidos: number;
}

@Component({
  selector: 'app-perfil-oyente',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mi-perfil-oyente.component.html',
  styleUrl: './mi-perfil-oyente.component.css'
})
export class MiPerfilOyenteComponent implements OnInit {

  isModalOpen = false;
  isModalContrasenaOpen = false;
  isModalEliminarOpen = false;
  isModalPlaylistOpen = false;

  foto: string ='';
  oyente: misDatos = { nombre: '', nSeguidores: 0, nSeguidos: 0 };
  ultimosArtistas: any[] = [];
  misPlaylists: any[] = [];
  ultimasCanciones: any[] = [];
  seguidos: any[] = [];
  isAuthenticated: boolean = false;
  mensajeError = '';
  credentials= {contrasenya:''};
  fotoPortada: File | null = null;
  nombrePlaylist: string = '';
  previewFoto: string | null = null;


  @Output() trackClicked = new EventEmitter<any>();

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router, private playerService: PlayerService, private progressService: ProgressService){}

  ngOnInit(): void {

    if(!this.tokenService.isAuthenticatedAndOyente()) {
      this.router.navigate(['/login'])
      return;
    }

    this.isAuthenticated = true;
    this.foto = this.tokenService.getUser().fotoPerfil;

    this.authService.pedirMisDatosOyente().subscribe({
      next: (oyente) => {
        this.oyente.nombre = oyente.nombre;
        this.oyente.nSeguidores = oyente.seguidores_count;
        this.oyente.nSeguidos = oyente.seguidos_count;
      },
      error: (error) => {
        console.error('Error al pedir los datos del oyente:', error);
      }
    });

    forkJoin({
      ultimosArtistas: this.authService.pedirTopArtistas(),
      misPlaylists: this.authService.pedirMisPlaylists(),
      ultimasCanciones: this.authService.pedirHistorialCanciones(),
      seguidos: this.authService.pedirMisSeguidos()
    }).subscribe({
      next: (response) => {   
        this.ultimosArtistas = response.ultimosArtistas.historial_artistas;
        this.ultimasCanciones = response.ultimasCanciones.historial_canciones;
        this.misPlaylists = response.misPlaylists.playlists;
        this.seguidos = response.seguidos.seguidos;

      },
      error: (error) => {
        console.error('Error en alguna de las peticiones:', error);
      },
      complete: () => {
        console.log('Todas las peticiones completadas');
      }
    });
  }

  abrirModal() {
    this.isModalOpen = true;
  }

  abrirModalContrasena() {
    this.isModalContrasenaOpen = true;
  }

  abrirModalEliminar() {
    this.isModalEliminarOpen = true;
  }
  
  abrirModalPlaylist() {
    this.isModalPlaylistOpen = true;
    this.previewFoto = null;
    console.log('Modal abierto:', this.isModalPlaylistOpen);
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  cerrarModalContrasena() {
    this.isModalContrasenaOpen = false;
  }

  cerrarModalEliminar() {
    this.isModalEliminarOpen = false;
  }

  cerrarModalPlaylist() {
    this.isModalPlaylistOpen = false;
    this.previewFoto = null;
  }


  guardarCambios() {

  }

  guardarCambiosContrasena() {
    const nuevaContrasena = (document.getElementById('contrasena_nueva') as HTMLInputElement).value;

    if (nuevaContrasena.length < 10) {
      this.mensajeError = '*La nueva contraseña debe tener al menos 10 caracteres.';
      return;
    }

    const tieneLetra = /[a-zA-Z]/.test(nuevaContrasena);
    if (!tieneLetra) {
      this.mensajeError = '*La nueva contraseña debe contener al menos una letra.';
      return;
    }

    const tieneNumero = /\d/.test(nuevaContrasena);
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(nuevaContrasena);

    if (!(tieneNumero || tieneCaracterEspecial)) {
      this.mensajeError = '*La nueva contraseña debe contener al menos un número o carácter especial.';
      return;
    }

    this.mensajeError = '';

  }

  guardarCambiosPlaylist() {
    if (!this.nombrePlaylist) {
      alert("Por favor, ingresa un nombre para la playlist.");
      return;
    }
  
    const foto = this.fotoPortada ? this.fotoPortada : "logo_noizz.png"; // Imagen predeterminada
  
    this.authService.crearPlaylist(foto, this.nombrePlaylist)
    .subscribe({
      next: () => {   
        this.cerrarModalPlaylist();
      },
      error: (error) => {
        console.error("Error al crear la playlist:", error);
      },
      complete: () => {
        console.log("Playlist creada con éxito");
      }
    });
  }
  


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file);
      // Aquí puedes procesar el archivo o cargarlo a un servidor
    }
  }

  onFileSelectedPlaylist(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.fotoPortada = file;
  
      // Crear una URL temporal para previsualizar la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.previewFoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  

  onTrackClick(track: any) {
    // En lugar de emitir el evento, llamamos al servicio para actualizar el track
    this.playerService.setTrack(track);
  }

  cerrarSesion(): void {
  
    let currentProgress = this.tokenService.getProgresoLocal();

    if(currentProgress == null) {
      this.authService.logout()
      .subscribe({
        next: () => {   
          this.tokenService.clearStorage();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al guardar el progreso:', error);
        },
        complete: () => {
          console.log('Petición completada');
        }
      });
  
    } else {
      this.authService.guardarProgreso(currentProgress)
      .pipe(
        switchMap(() => this.authService.logout()) // Espera a que guardarProgreso() termine antes de llamar a logout()
      )
      .subscribe({
        next: () => {   
          this.tokenService.clearStorage();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al guardar el progreso:', error);
        },
        complete: () => {
          console.log('Petición completada');
        }
      });
    }
  }

  eliminarCuenta() {
    this.credentials.contrasenya = (document.getElementById('contrasena_eliminar') as HTMLInputElement).value;
    this.authService.eliminarCuenta(this.credentials)
    .subscribe({
      next: () => {   
        this.tokenService.clearStorage();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al eliminar la cuenta:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });

  }
  

}
