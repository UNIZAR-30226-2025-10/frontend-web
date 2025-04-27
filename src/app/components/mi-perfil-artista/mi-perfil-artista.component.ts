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
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { ActualizarFotoPerfilService } from '../../services/actualizar-foto-perfil.service';
import { NotificationService } from '../../services/notification.service';


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

  oyente: misDatos = { nombreUsuario: '', nombreArtistico: '', biografia: '', nSeguidores: 0, nSeguidos: 0 };
  misCanciones: any[] = [];
  misAlbumes: any[] = [];
  topArtistas: any[] = [];
  ultimasCanciones: any[] = [];
  misPlaylists: any[] = [];

  mensajeError = '';
  credentials= {contrasenya:''};

  //para lo de editar perfil
  nombreActual: string = '';
  nombreArtisticoActual: string = '';
  biografiaActual: string = '';
  foto: string ='';
  fotoNueva!: string;
  file!: File;

  //para editar contraseña
  isPasswordViejaVisible: boolean = false;
  isPasswordNuevaVisible: boolean = false;
  isPasswordIntroducida: boolean = false;

  constructor(private authService: AuthService, private tokenService: TokenService,  private router: Router, private playerService: PlayerService, private subirCloudinary: SubirCloudinary, private actFotoService: ActualizarFotoPerfilService,private notificationService: NotificationService){}

  ngOnInit(): void {

    this.foto = this.tokenService.getUser().fotoPerfil;
    this.fotoNueva = this.foto;
    this.authService.pedirMisDatosArtista()
    .subscribe({
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
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      }
    });

    forkJoin({
      misCanciones: this.authService.pedirMisCancionesArtistaLimitado(15),
      misAlbumes: this.authService.pedirMisAlbumesArtistaLimitado(15),
      topArtistas: this.authService.pedirTopArtistasLimitado(15), 
      ultimasCanciones: this.authService.pedirHistorialCancionesLimitado(15),
      misPlaylists: this.authService.pedirMisPlaylistsLimitado(15),
    }).subscribe({
      next: (response) => {   
        this.misCanciones = response.misCanciones.canciones;
        this.misAlbumes = response.misAlbumes.albumes;
        this.topArtistas = response.topArtistas.historial_artistas;
        this.ultimasCanciones = response.ultimasCanciones.historial_canciones;
        this.misPlaylists = response.misPlaylists.playlists;
        console.log('todo',response);
      },
      error: (error) => {
        console.error('Error en alguna de las peticiones:', error);
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
    this.isPasswordIntroducida = false;
    this.isModalEliminarOpen = true;
  }

 
  cerrarModal() {
    this.nombreActual = this.oyente.nombreUsuario;
    this.nombreArtisticoActual = this.oyente.nombreArtistico
    this.biografiaActual = this.oyente.biografia;
    this.fotoNueva = this.foto;
    this.mensajeError = '';
    this.isModalOpen = false;
  }

  cerrarModalContrasena() {
    this.mensajeError = '';
    this.isModalContrasenaOpen = false;
  }

  cerrarModalEliminar() {
    this.mensajeError = '';
    this.isModalEliminarOpen = false;
  }


  guardarCambios() {

    if (this.nombreActual.includes(" "))  {
      this.mensajeError = '*El nombre de usuario no puede contener espacios.';
      return;
    }

    if (this.nombreActual.includes(","))  {
      this.mensajeError = '*El nombre de usuario no puede contener el carácter ",".';
      return;
    }

    if (this.nombreActual.includes("@"))  {
      this.mensajeError = '*El nombre de usuario no puede contener el carácter "@".';
      return;
    }

    this.mensajeError = '';

    if (this.fotoNueva !== this.foto && this.fotoNueva != "nouser.png") {
      
      this.subirCloudinary.uploadFile(this.file, 'artistas').pipe(     
        switchMap((url) => {
          console.log('Imagen subida:', url);
          this.fotoNueva = url;
          return this.authService.cambiarDatosArtista(this.nombreActual, this.nombreArtisticoActual, this.biografiaActual, this.fotoNueva);
        })
      ).subscribe({
        next: () => {   
          this.oyente.nombreUsuario = this.nombreActual;
          this.oyente.nombreArtistico = this.nombreArtisticoActual;
          this.oyente.biografia = this.biografiaActual;
          this.foto = this.fotoNueva;
          if (this.foto !== this.tokenService.getUser().fotoPerfil) {
            const user = this.tokenService.getUser();
            user.fotoPerfil = this.foto;
            this.tokenService.setUser(user);
            this.actFotoService.actualizarFoto();
          }
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al guardar los nuevos datos:", error);
          this.nombreActual = this.oyente.nombreUsuario;
          this.nombreArtisticoActual = this.oyente.nombreArtistico;
          this.biografiaActual = this.oyente.biografia;
          this.fotoNueva = this.foto;
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
          console.log("Datos guardados con éxito");
        }
      });
    } else {
      if (this.fotoNueva === "nouser.png" && this.fotoNueva !== this.foto) {
        this.authService.cambiarDatosOyente(this.nombreActual, 'DEFAULT')
        .subscribe({
          next: () => {
            this.oyente.nombreUsuario = this.nombreActual;
            this.oyente.nombreArtistico = this.nombreArtisticoActual;
            this.oyente.biografia = this.biografiaActual;
            this.foto = this.fotoNueva;
            if (this.foto !== this.tokenService.getUser().fotoPerfil) {
              const user = this.tokenService.getUser();
              user.fotoPerfil = this.foto;
              this.tokenService.setUser(user);
              this.actFotoService.actualizarFoto();
            }
            this.cerrarModal();
          },
          error: (error) => {
            console.error("Error al guardar los nuevos datos:", error);
            this.oyente.nombreUsuario = this.nombreActual;
            this.oyente.nombreArtistico = this.nombreArtisticoActual;
            this.oyente.biografia = this.biografiaActual;
            this.fotoNueva = this.foto;
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
            console.log("Datos guardados con éxito");
          }
        });
      } else {
        let fotoMandar = this.fotoNueva
        if (this.fotoNueva === "nouser.png") {
          fotoMandar = 'DEFAULT'
        }

        this.authService.cambiarDatosArtista(this.nombreActual, this.nombreArtisticoActual, this.biografiaActual, this.fotoNueva).subscribe({
          next: () => {
            this.oyente.nombreUsuario = this.nombreActual;
            this.oyente.nombreArtistico = this.nombreArtisticoActual;
            this.oyente.biografia = this.biografiaActual;
            this.cerrarModal();
          },
          error: (error) => {
            console.error("Error al guardar los nuevos datos:", error);
            this.nombreActual = this.oyente.nombreUsuario;
            this.nombreArtisticoActual = this.oyente.nombreArtistico;
            this.biografiaActual = this.oyente.biografia;
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
            console.log("Datos guardados con éxito");
          }
        });
      }
    }
  }
  

  guardarCambiosContrasena() {
    const viejaContrasena = (document.getElementById('contrasena_actual') as HTMLInputElement).value;
    const nuevaContrasena = (document.getElementById('contrasena_nueva') as HTMLInputElement).value;

    if (viejaContrasena === '') {
      this.mensajeError = '*Debes introducir la contraseña actual.';
      return;
    }
    
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
        console.log("Contraseña guardada con éxito");
      }
    });

  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoNueva = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  quitarFoto() {
    this.fotoNueva = "nouser.png";
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
        this.mensajeError = error.error.error
        console.error('Error al eliminar la cuenta:', error);
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

  togglePasswordIntroducida(): void {
    this.isPasswordIntroducida = !this.isPasswordIntroducida;
  }

  navigateToSubirCancion() {
    this.router.navigate(['/home/subir-cancion']);
  }

  navigateToSubirAlbum() {
    this.router.navigate(['/home/subir-album']);
  }
  

}