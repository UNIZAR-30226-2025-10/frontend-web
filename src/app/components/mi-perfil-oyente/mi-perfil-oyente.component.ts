import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
<<<<<<< Updated upstream
=======
import { forkJoin } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { ProgressService } from '../../services/progress.service';
import { switchMap } from 'rxjs/operators';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { ChangeDetectorRef } from '@angular/core';
>>>>>>> Stashed changes

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

  nombreActual: string = "martaRata2004"; // ESTO ES OYENTE.NOMBRE

  oyente! : misDatos;
  ultimosArtistas: any[] = [];
  miPlaylists: any[] = [];
  ultimasCanciones: any[] = [];
  seguidos: any[] = [];
<<<<<<< Updated upstream
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router){}

  ngOnInit(): void {

    if(!this.tokenService.isAuthenticatedAndOyente()) {
      this.router.navigate(['/login'])
      return;
    }

    this.isAuthenticated = true;
=======
  mensajeError = '';
  credentials= {contrasenya:''};
  fotoPortada: File | null = null;
  nombrePlaylist: string = '';
  previewFoto: string | null = null;

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
    this.previewFoto = null;
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
    this.previewFoto = null;
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
>>>>>>> Stashed changes
    
    this.authService.pedirMisDatosOyente()
    .subscribe({
      next: (response) => {
        console.log('UQE RECIBO: ', response);
        this.oyente.nombre = response.oyente.nombreUsuario;
        this.oyente.nSeguidores= response.oyente.seguidores;
        this.oyente.nSeguidos = response.oyente.seguidos;       
      },
      error: (error) => {
        console.error('Error al pedir los datos:', error);

<<<<<<< Updated upstream
=======
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
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoNueva = e.target.result; // Asigna la URL base64 de la imagen a la variable foto
      };
      reader.readAsDataURL(this.file);
    }
  }

  onFileSelectedPlaylist(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.fotoPortada = file;
      
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
>>>>>>> Stashed changes
      },
      complete: () => {
        console.log('Petición completada');
      }
    });

    this.authService.pedirTopArtistas()
    .subscribe({
      next: (response) => {
        this.ultimosArtistas = response.artistas;
      },
      error: (error) => {
        console.error('Error al pedir los datos:', error);

      },
      complete: () => {
        console.log('Petición completada');
      }
    });

    this.authService.pedirHistorialCanciones()
    .subscribe({
      next: (response) => {
        this.ultimasCanciones = response.canciones;
      },
      error: (error) => {
        console.error('Error al pedir los datos:', error);

      },
      complete: () => {
        console.log('Petición completada');
      }
    });

    this.authService.pedirMisPlaylists()
    .subscribe({
      next: (response) => {
        this.miPlaylists = response.playlists;
      },
      error: (error) => {
        console.error('Error al pedir los datos:', error);

      },
      complete: () => {
        console.log('Petición completada');
      }
    });

    //PREGUNTAR POR MIRAR LO Q DEVUELVE
    this.authService.pedirMisSeguidos()
    .subscribe({
      next: (response) => {
        this.seguidos = response.seguidos;
      },
      error: (error) => {
        console.error('Error al pedir los datos:', error);

      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

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

  abrirModal() {
    this.isModalOpen = true;
    console.log('hola')
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarCambios() {

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file);
      // Aquí puedes procesar el archivo o cargarlo a un servidor
    }
  }
  

}
