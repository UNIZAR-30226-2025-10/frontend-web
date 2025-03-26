import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PlayerService } from '../../services/player.service';


interface misDatos {
  nombreUsuario: string;
  nombreArtistico: string;
  biografia: string;
  nSeguidores: number;
  nSeguidos: number;
}

@Component({
  selector: 'app-mi-perfil-artista',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mi-perfil-artista.component.html',
  styleUrl: './mi-perfil-artista.component.css'
})
export class MiPerfilArtistaComponent implements OnInit {

  isModalOpen = false;
  isModalContrasenaOpen = false;
  isModalEliminarOpen = false;

  isAuthenticated: boolean = false;
  foto: string ='';
  oyente: misDatos = { nombreUsuario: '', nombreArtistico: '', biografia: '', nSeguidores: 0, nSeguidos: 0 };
  misCanciones: any[] = [];
  misAlbumes: any[] = [];
  topArtistas: any[] = [];
  ultimasCanciones: any[] = [];
  misPlaylists: any[] = [];
  seguidos: any[] = [];

  mensajeError = '';
  credentials= {contrasenya:''};

  //para lo de editar perfil
  nombreActual: string = '';
  nombreArtisticoActual: string = '';
  biografiaActual: string = '';

  //para editar contraseña
  isPasswordViejaVisible: boolean = false;
  isPasswordNuevaVisible: boolean = false;


  artistas = [
    { name: 'Usuario 1', img: 'https://randomuser.me/api/portraits/men/16.jpg', status: 'status-red' },
    { name: 'Usuario 2', img: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'status-red' },
    { name: 'Usuario 3', img: 'https://randomuser.me/api/portraits/men/3.jpg', status: 'status-red' },
    { name: 'Usuario 4', img: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'status-red' },
    { name: 'Usuario 5', img: 'https://randomuser.me/api/portraits/men/5.jpg', status: 'status-red' },
    { name: 'Usuario 6', img: 'https://randomuser.me/api/portraits/women/92.jpg', status: 'status-red' },
    { name: 'Usuario 7', img: 'https://randomuser.me/api/portraits/men/6.jpg', status: 'status-red' },
    { name: 'Usuario 8', img: 'https://randomuser.me/api/portraits/women/4.jpg', status: 'status-red' },
    { name: 'Usuario 9', img: 'https://randomuser.me/api/portraits/men/8.jpg', status: 'status-red' },
    { name: 'Usuario 10', img: 'https://randomuser.me/api/portraits/men/23.jpg', status: 'status-red' }
  ];

  constructor(private authService: AuthService, private tokenService: TokenService,  private router: Router, private playerService: PlayerService){}

  ngOnInit(): void {

    if(!this.tokenService.isAuthenticatedAndArtista()) {
      this.router.navigate(['/login'])
      return;
    }

    this.isAuthenticated = true;

    this.foto = this.tokenService.getUser().fotoPerfil;
    this.authService.pedirMisDatosArtista().subscribe({
      next: (oyente) => {
        this.oyente.nombreUsuario = oyente.nombre;
        this.oyente.nombreArtistico = oyente.nombreArtistico;
        this.oyente.biografia = oyente.biografia;
        this.oyente.nSeguidores = oyente.numSeguidores;
        this.oyente.nSeguidos = oyente.numSeguidos;

        this.nombreActual = this.oyente.nombreUsuario;
        this.nombreArtisticoActual = this.oyente.nombreArtistico;
        this.biografiaActual = this.oyente.biografia;
      },
      error: (error) => {
        console.error('Error al pedir los datos del artista:', error);
      }
    });

    forkJoin({
      misCanciones: this.authService.pedirMisCancionesArtista(),
      misAlbumes: this.authService.pedirMisAlbumesArtista(),
      topArtistas: this.authService.pedirTopArtistas(),
      ultimasCanciones: this.authService.pedirHistorialCanciones(),
      misPlaylists: this.authService.pedirMisPlaylists(),
      seguidos: this.authService.pedirMisSeguidos()

    }).subscribe({
      next: (response) => {   
        this.misCanciones = response.misCanciones.canciones;
        this.misAlbumes = response.misAlbumes.albumes;
        this.topArtistas = response.topArtistas.historial_artistas;
        this.ultimasCanciones = response.ultimasCanciones.historial_canciones;
        this.misPlaylists = response.misPlaylists.playlists;
        this.seguidos = response.seguidos.seguidos;
        console.log(this.topArtistas);
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
    this.isPasswordViejaVisible = false;
    this.isPasswordNuevaVisible = false;
    this.isModalContrasenaOpen = true;
  }

  abrirModalEliminar() {
    this.isModalEliminarOpen = true;
  }

 
  cerrarModal() {
    this.nombreActual = this.oyente.nombreUsuario;
    this.nombreArtisticoActual = this.oyente.nombreArtistico
    this.biografiaActual = this.oyente.biografia;
    this.isModalOpen = false;
  }

  cerrarModalContrasena() {
    this.isModalContrasenaOpen = false;
  }

  cerrarModalEliminar() {
    this.isModalEliminarOpen = false;
  }


  guardarCambios() {
    this.authService.cambiarDatosArtista(this.nombreActual, this.nombreArtisticoActual, this.biografiaActual, this.foto)
    .subscribe({
      next: () => {   
        this.oyente.nombreUsuario = this.nombreActual;
        this.oyente.nombreArtistico = this.nombreArtisticoActual;
        this.oyente.biografia = this.biografiaActual;
        this.cerrarModal();
      },
      error: (error) => {
        console.error("Error al guardar los nuevos datos:", error);
      },
      complete: () => {
        console.log("Datos guardados con éxito");
      }
    });
  }

  guardarCambiosContrasena() {
    const viejaContrasena = (document.getElementById('contrasena_actual') as HTMLInputElement).value;
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
    this.authService.cambiarContrasenyaOyente(viejaContrasena, nuevaContrasena)
    .subscribe({
      next: () => {   
        this.cerrarModalContrasena();
      },
      error: (error) => {
        console.error("Error al cambiar la contraseña:", error);
      },
      complete: () => {
        console.log("Contraseña guardada con éxito");
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

  onTrackClick(track: any) {
    this.playerService.setTrack(track);
  }

  togglePasswordVieja(): void {
    this.isPasswordViejaVisible = !this.isPasswordViejaVisible;
  }

  togglePasswordNueva(): void {
    this.isPasswordNuevaVisible = !this.isPasswordNuevaVisible;
  }

}
