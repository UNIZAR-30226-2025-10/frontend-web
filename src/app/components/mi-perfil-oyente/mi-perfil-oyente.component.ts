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
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { ChangeDetectorRef } from '@angular/core';

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



  oyente: misDatos = { nombre: '', nSeguidores: 0, nSeguidos: 0 };
  ultimosArtistas: any[] = [];
  misPlaylists: any[] = [];
  ultimasCanciones: any[] = [];
  seguidos: any[] = [];
  mensajeError = '';
  credentials= {contrasenya:''};
  fotoPortada!: string;
  fileP!: File;
  nombrePlaylist: string = '';

  //para editar perfil
  nombreActual: string = '';
  foto: string ='';
  fotoNueva!: string;
  file!: File;

  //para editar contraseña
  isPasswordViejaVisible: boolean = false;
  isPasswordNuevaVisible: boolean = false;


  @Output() trackClicked = new EventEmitter<any>();

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router, private playerService: PlayerService, private progressService: ProgressService, private subirCloudinary: SubirCloudinary, private changeDetectorRef: ChangeDetectorRef){}

  ngOnInit(): void {

    this.foto = this.tokenService.getUser().fotoPerfil;
    this.fotoNueva = this.foto;

    this.authService.pedirMisDatosOyente().subscribe({
      next: (oyente) => {
        this.oyente.nombre = oyente.nombreUsuario;
        this.nombreActual = this.oyente.nombre;
        this.oyente.nSeguidores = oyente.numSeguidores;
        this.oyente.nSeguidos = oyente.numSeguidos;
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
    this.isPasswordViejaVisible = false;
    this.isPasswordNuevaVisible = false;
    this.isModalContrasenaOpen = true;
  }

  abrirModalEliminar() {
    this.isModalEliminarOpen = true;
  }
  
  abrirModalPlaylist() {
    this.isModalPlaylistOpen = true;
    console.log('Modal abierto:', this.isModalPlaylistOpen);
  }

  cerrarModal() {
    this.nombreActual = this.oyente.nombre;
    this.fotoNueva = this.foto;
    this.mensajeError = '';
    this.isModalOpen = false;
  }

  cerrarModalContrasena() {
    this.mensajeError = '';
    this.isModalContrasenaOpen = false;
  }

  cerrarModalEliminar() {
    this.isModalEliminarOpen = false;
  }

  cerrarModalPlaylist() {
    this.isModalPlaylistOpen = false;
    this.fotoPortada = '';
  }


  guardarCambios() {

    if (this.nombreActual.includes(" "))  {
      this.mensajeError = '*El nombre de usuario no puede contener espacios.';
      return;
    }

    this.mensajeError = '';
    if (this.fotoNueva !== this.foto) {
      this.subirCloudinary.uploadFile(this.file, 'perfiles').pipe(

        switchMap((url) => {
          console.log('Imagen subida:', url);
          this.fotoNueva = url;
          return this.authService.cambiarDatosOyente(this.nombreActual, this.fotoNueva);
        })
      ).subscribe({
        next: () => {
          this.oyente.nombre = this.nombreActual;
          this.foto = this.fotoNueva;
          if (this.foto !== this.tokenService.getUser().fotoPerfil) {
            const user = this.tokenService.getUser();
            user.fotoPerfil = this.foto;
            this.tokenService.setUser(user);
          }
          console.log('FOTO PERFIL DESPUES', this.tokenService.getUser().fotoPerfil);
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al guardar los nuevos datos:", error);
          this.nombreActual = this.oyente.nombre;
          this.fotoNueva = this.foto;
        },
        complete: () => {
          console.log("Datos guardados con éxito");
        }
      });
    } else {
      this.authService.cambiarDatosOyente(this.nombreActual, this.fotoNueva)
      .subscribe({
        next: () => {
          this.oyente.nombre = this.nombreActual;
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al guardar los nuevos datos:", error);
          this.nombreActual = this.oyente.nombre;
        },
        complete: () => {
          console.log("Datos guardados con éxito");
        }
      });
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
      },
      complete: () => {
        console.log("Contraseña guardada con éxito");
      }
    });

  }

  guardarCambiosPlaylist() {
    if (this.fileP) { // Verifica si hay un archivo seleccionado
        this.subirCloudinary.uploadFile(this.fileP, 'playlist').pipe(
            switchMap((url) => {
                console.log('Imagen subida:', url);
                this.fotoPortada = url;
                return this.authService.crearPlaylist(this.fotoPortada, this.nombrePlaylist);
            })
        ).subscribe({
            next: () => {
                this.cerrarModalPlaylist();
                console.log("Playlist creada con éxito");
            },
            error: (error) => {
                console.error("Error al crear la playlist", error);
            }
        });
    } else {
        const foto = this.fotoPortada ? this.fotoPortada : "DEFAULT"; // Imagen predeterminada
        this.authService.crearPlaylist(foto, this.nombrePlaylist)
        .subscribe({
            next: () => {   
                this.cerrarModalPlaylist();
                console.log("Playlist creada con éxito");
            },
            error: (error) => {
                console.error("Error al crear la playlist:", error);
            }
        });
    }
}

onFileSelectedPlaylist(event:any) {
    this.fileP = event.target.files[0];
    if (this.fileP) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.fotoPortada = e.target.result; // Asigna la URL base64 de la imagen a la variable fotoPortada
        };
        reader.readAsDataURL(this.fileP);
    }
}
  

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoNueva = e.target.result; // Asigna la URL base64 de la imagen a la variable foto
      };
      reader.readAsDataURL(this.file);
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
          console.log('lo que envio:', this.tokenService.getCancionActual());
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

  togglePasswordVieja(): void {
    this.isPasswordViejaVisible = !this.isPasswordViejaVisible;
  }

  togglePasswordNueva(): void {
    this.isPasswordNuevaVisible = !this.isPasswordNuevaVisible;
  }
  

}
