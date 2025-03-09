import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { take } from 'rxjs';

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
  currentTrack: any;


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

    this.playerService.isPlaying$.subscribe(isPlaying => {
      this.isPlaying = isPlaying; 
    });

    this.playerService.currentTrack$.subscribe(track => {
      this.isPlaying = !!track; // Si hay una canción, isPlaying será true
      this.currentTrack = track;
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
    this.playerService.currentTrack$.pipe(take(1)).subscribe(currentTrack => {
      // Verifica si el álbum actual es diferente al álbum que seleccionaste
      if (currentTrack) {
        // Si ya hay una canción en reproducción
        if (currentTrack.albumId !== album.id) {
          // Si el álbum actual es diferente, pausa la reproducción y establece el nuevo álbum (de momento no va en las canciones no tenemos el album al que pertenecen)
          this.playerService.togglePlay(); // Pausa si ya está sonando algo
          this.playerService.setAlbum(album); // Establece el nuevo álbum
        } else {
          // Si el álbum es el mismo, alterna play/pause
          this.playerService.togglePlay();
        }
      } else {
        // Si no hay ninguna canción en reproducción, establece el álbum y comienza a reproducir
        this.playerService.setAlbum(album);
      }
    });
  }
  
  
  onTrackClick(track: any) {
    // Llamamos al servicio para establecer la canción seleccionada y el álbum con la lista de canciones
    this.playerService.setTrack(track, this.album?.canciones); // Pasamos la lista de canciones del álbum
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
