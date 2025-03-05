import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

interface misDatos {
  fotoPerfil: string;
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
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router){}

  ngOnInit(): void {

    if(!this.tokenService.isAuthenticatedAndOyente()) {
      this.router.navigate(['/login'])
      return;
    }

    this.isAuthenticated = true;
    
    this.authService.pedirMisDatos()
    .subscribe({
      next: (response) => {
        this.oyente.fotoPerfil = response.oyente.fotoPerfil;
        this.oyente.nombre = response.oyente.nombre;
        this.oyente.nSeguidores= response.oyente.nSeguidores;
        this.oyente.nSeguidos = response.oyente.nSeguidos;       
      },
      error: (error) => {
        console.error('Error al pedir los datos:', error);

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
