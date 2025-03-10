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

  foto: string ='';
  oyente: misDatos = { nombre: '', nSeguidores: 0, nSeguidos: 0 };
  ultimosArtistas: any[] = [];
  misPlaylists: any[] = [];
  ultimasCanciones: any[] = [];
  seguidos: any[] = [];
  isAuthenticated: boolean = false;

  @Output() trackClicked = new EventEmitter<any>();

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router, private playerService: PlayerService, private progressService: ProgressService){}

  ngOnInit(): void {

    if(!this.tokenService.isAuthenticatedAndOyente()) {
      this.router.navigate(['/login'])
      return;
    }

    this.isAuthenticated = true;
    this.foto = this.tokenService.getUser().fotoPerfil;

    forkJoin({
      oyente: this.authService.pedirMisDatosOyente(),
      ultimosArtistas: this.authService.pedirTopArtistas(),
      misPlaylists: this.authService.pedirMisPlaylists(),
      ultimasCanciones: this.authService.pedirHistorialCanciones(),
      seguidos: this.authService.pedirMisSeguidos()
    }).subscribe({
      next: (response) => {
        this.oyente.nombre = response.oyente.nombre;
        this.oyente.nSeguidores= response.oyente.seguidores_count;
        this.oyente.nSeguidos = response.oyente.seguidos_count;    
        this.ultimosArtistas = Object.values(response.ultimosArtistas.historial_artistas);
        this.ultimasCanciones = Object.values(response.ultimasCanciones.historial_canciones);
        this.misPlaylists = Object.values(response.misPlaylists.playlists);
        this.seguidos = Object.values(response.seguidos.seguidos);

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

  onTrackClick(track: any) {
    // En lugar de emitir el evento, llamamos al servicio para actualizar el track
    this.playerService.setTrack(track);
  }

  cerrarSesion(): void {

    const currentProgress = this.tokenService.getProgresoLocal();

    this.authService.guardarProgreso(currentProgress)
    .subscribe({
      next: () => {   
      },
      error: (error) => {
        console.error('Error al guardar el progreso:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });

    this.authService.logout()
    .subscribe({
      next: () => {
        this.tokenService.clearStorage();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar la sesión:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }
  

}
