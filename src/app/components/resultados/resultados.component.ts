import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResultadosService } from '../../services/resultados.service';
import { PlayerService } from '../../services/player.service';
import { LimpiarBuscadorService } from '../../services/limpiar-buscador.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  searchQuery: string = '';
  artists: any[] = [];
  tracks: any[] = [];
  albums: any[] = [];
  playlists: any[] = [];
  perfiles: any[] = [];
  filtroActivo: string = 'todo';

  @Output() trackClicked = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private resultadosService: ResultadosService, private playerService: PlayerService,  private LimpiarBuscadorService: LimpiarBuscadorService, private location: Location, private router: Router) {}

  ngOnInit() {

    // Obtener el parámetro de búsqueda de la URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
    });

    // Suscribirse al servicio para obtener los resultados
    this.resultadosService.resultados$
    .subscribe({
      next: (data) => {
        // Guardar los valores en las variables correspondientes
        this.artists = data.artistas ?? [];
        this.tracks = data.canciones ?? [];
        this.albums = data.albumes ?? [];
        this.playlists = data.playlists ?? [];
      },
      error: (error) => {
        console.error('Error al autenticar:', error);
      },
      complete: () => {
        console.log('Petición completada');
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

  onScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop; 
    const filtros = document.querySelector('.filtros'); 
    
    if (filtros) {
        if (scrollTop > 10) {
            filtros.classList.add('scrolled'); 
            console.log('aqui');
        } else {
            filtros.classList.remove('scrolled'); 
        }
    }
}

}

