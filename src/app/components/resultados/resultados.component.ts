import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResultadosService } from '../../services/resultados.service';
import { PlayerService } from '../../services/player.service';
import { LimpiarBuscadorService } from '../../services/limpiar-buscador.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  searchQuery: string = '';
  artists: any[] = [];
  tracks: any[] = [];
  albums: any[] = [];
  playlists: any[] = [];
  filtroActivo: string = 'todo';

  @Output() trackClicked = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private resultadosService: ResultadosService, private playerService: PlayerService,  private LimpiarBuscadorService: LimpiarBuscadorService, private location: Location, private router: Router) {}

  ngOnInit() {

    // Obtener el parámetro de búsqueda de la URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
    });

    // Suscribirse al servicio para obtener los resultados
<<<<<<< Updated upstream
    this.resultadosService.resultados$.subscribe(data => {
      if (data) {
=======
    this.resultadosService.resultados$
    .subscribe({
      next: (data) => {
>>>>>>> Stashed changes
        // Guardar los valores en las variables correspondientes
        this.artists = data.artists ?? [];
        this.tracks = data.tracks ?? [];
        this.albums = data.albums ?? [];
        this.playlists = data.playlists ?? [];
<<<<<<< Updated upstream
      } else {
        console.warn('No hay resultados disponibles.');
=======
        this.perfiles = data.perfiles ?? [];
      },
      error: (error) => {
        console.error('Error al autenticar:', error);
      },
      complete: () => {
        console.log('Petición completada');
>>>>>>> Stashed changes
      }
    });
  }

  onTrackClick(track: any) {
    // En lugar de emitir el evento, llamamos al servicio para actualizar el track
    this.playerService.setTrack(track);
  }

  volverAtras() {

    this.LimpiarBuscadorService.setBuscador(true);
    // Intentamos retroceder a la página anterior
    let previousUrl = this.location.path(); // Obtener la URL actual

    // Si la URL actual contiene 'search', vamos hacia atrás y verificamos la anterior
    if (previousUrl.includes('search')) {
      // Hacemos que el navegador regrese en el historial (puedes cambiar esto si prefieres usar location)
      this.location.back();
      setTimeout(() => {
        // Verificamos la nueva URL después de ir hacia atrás
        const currentUrl = this.location.path();
        if (currentUrl.includes('search')) {
          // Si aún contiene 'search', redirigimos a la página de inicio u otra página deseada
          this.router.navigate(['/home']);
        }
      }, 200); // Retraso para permitir que se haya cambiado la URL en el historial
    } else {
      // Si no contiene 'search', ya estamos donde queremos
      this.location.back();
    }
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
  }

}

