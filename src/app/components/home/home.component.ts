import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router'; 
import { forkJoin } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [RouterModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  messageReceived: string = '';

  recientes: any[] = [];
  artistas: any[] = [];
  ultimasCanciones: any[] = [];
  misPlaylists: any[] = [];
  recomendados: any[] = [];

  @Output() trackClicked = new EventEmitter<any>();

  constructor(private route: ActivatedRoute,private authService:AuthService, private tokenService : TokenService, private router: Router, private playerService: PlayerService) {}

  ngOnInit(): void {

    forkJoin({
      artistas: this.authService.pedirTopArtistas(),
      recientes: this.authService.pedirColeccionesRecientes(),
      canciones: this.authService.pedirHistorialCanciones(),
      playlists: this.authService.pedirMisPlaylists()
    }).subscribe({
      next: (data) => {
        this.artistas = data.artistas.historial_artistas;
        this.recientes = data.recientes.historial_colecciones;
        this.ultimasCanciones = data.canciones.historial_canciones;
        this.misPlaylists = data.playlists.playlists;
        this.intentarMezclar();
      },
      error: (error) => {
        console.error('Error en alguna de las peticiones principales:', error);
      }
    });
  
    // Carga las recomendaciones por separado
    this.cargarRecomendaciones();
  }
  
  cargarRecomendaciones() {
    this.authService.pedirRecomendaciones().subscribe({
      next: (data) => {
        this.recomendados = data.canciones_recomendadas;
      },
      error: (error) => {
        console.error('Error cargando recomendaciones:', error);
      }
    });
  }

  intentarMezclar() {
    if (this.artistas.length > 0 && this.recientes.length > 0) {
      this.mezclarListas(); 
    }
  }

  mezclarListas() {

    let recientesConTipo = this.recientes.map(item => ({ ...item, type: 'reciente' }));
    let artistasConTipo = this.artistas.map(item => ({ ...item, type: 'artista' }));

    let totalRecientes = recientesConTipo.length;
    let totalArtistas = artistasConTipo.length;
  
    if (totalArtistas === 0) {
      this.recientes = recientesConTipo; // Si no hay artistas, no hay cambios
      return;
    }
  
    let resultado: any[] = [];
    let indiceRecientes = 0;
    let indiceArtistas = 0;
  
    while (indiceRecientes < totalRecientes || indiceArtistas < totalArtistas) {
      // Determinar cuántos recientes insertar entre los artistas (puede ser 1, 2 o 3)
      let cantidadRecientes = Math.min(3, totalRecientes - indiceRecientes);  // Asegura que no se pase del total de recientes
      if (cantidadRecientes === 3 && Math.random() > 0.5) {
        cantidadRecientes = 1;  // Hay un 50% de probabilidades de que haya solo 1 reciente
      } else if (cantidadRecientes === 3 && Math.random() > 0.2) {
        cantidadRecientes = 2;  // Hay un 20% de probabilidades de que haya 2 recientes
      }
  
      // Insertar los recientes seleccionados
      resultado.push(...recientesConTipo.slice(indiceRecientes, indiceRecientes + cantidadRecientes));
      indiceRecientes += cantidadRecientes;
  
      // Insertar un artista si hay disponibles
      if (indiceArtistas < totalArtistas) {
        resultado.push(artistasConTipo[indiceArtistas]);
        indiceArtistas++;
      }
    }
  
    this.recientes = resultado; // Guardar la lista intercalada
  }

  onTrackClick(track: any) {
    // En lugar de emitir el evento, llamamos al servicio para actualizar el track
    this.playerService.setTrack(track);
  }
  
}


