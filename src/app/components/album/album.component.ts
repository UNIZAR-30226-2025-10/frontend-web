import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-album',
  standalone: true, 
  imports: [CommonModule,DurationPipe],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']  
})
export class AlbumComponent /*implements OnInit*/ {
  album: any = null;
  artistNames: string = '';
  sidebarOpen = false;
  currentIndex: number = 0;
  isShuffle: boolean = false;
  isPlaying: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private sidebarService: SidebarService,
    private authService:AuthService,
  ) {}

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id'); 
    if (albumId) {
      this.getAlbum(albumId);  
    }

    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });
  }

  getAlbum(albumId: string): void {
    this.authService.datosAlbum(albumId)
    .subscribe({
      next: (data) => {
        this.album = data; 
      },
      error: (error) => {
        console.error('Error al autenticar:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

  onAlbumClick(album: any) {
    // Llamamos al servicio y le pasamos el álbum seleccionado
    this.playerService.setAlbum(album);
    this.isPlaying = this.isPlaying;
  }
  
  onTrackClick(track: any) {
    // Llamamos al servicio para establecer la canción seleccionada y el álbum con la lista de canciones
    this.playerService.setTrack(track, this.album?.canciones); // Pasamos la lista de canciones del álbum
    this.isPlaying = true;
  }

  getFormattedDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);  
    const remainingSeconds = seconds % 60;   
    return `${minutes} minutos ${remainingSeconds} segundos`;
  }

  toggleShuffle(): void {
    this.playerService.toggleShuffle(); // Habilitar o deshabilitar el shuffle
    this.isShuffle = this.playerService.isShuffleEnabled();
  }
}
