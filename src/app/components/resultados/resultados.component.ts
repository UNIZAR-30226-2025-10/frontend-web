import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResultadosService } from '../../services/resultados.service';
import { PlayerService } from '../../services/player.service';

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

  @Output() trackClicked = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private resultadosService: ResultadosService, private playerService: PlayerService) {}

  ngOnInit() {
    // Obtener el parámetro de búsqueda de la URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
    });

    // Suscribirse al servicio para obtener los resultados
    this.resultadosService.resultados$.subscribe(data => {
      if (data) {
        // Guardar los valores en las variables correspondientes
        this.artists = data.artists ?? [];
        this.tracks = data.tracks ?? [];
        this.albums = data.albums ?? [];
        this.playlists = data.playlists ?? [];
      } else {
        console.warn('No hay resultados disponibles.');
      }
    });
  }

  onTrackClick(track: any) {
    // En lugar de emitir el evento, llamamos al servicio para actualizar el track
    this.playerService.setTrack(track);
  }
}

