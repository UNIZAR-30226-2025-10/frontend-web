import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}



@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MusicPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('audioElement') audioElementRef!: ElementRef<HTMLAudioElement>; 
  currentTrack: any = null;
  isPlaying: boolean = false;
  private trackSubscription!: Subscription;
  currentTime: number = 0; // Tiempo actual de la canción
  duration: number = 0;
  volume: number = 50;
  player: any;  
  isFavorite = false;
  screenWidth: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth; 
  }

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    // Nos suscribimos al observable para recibir el track actualizado
    this.trackSubscription = this.playerService.currentTrack$.subscribe(track => {
      if (track) {
        this.currentTrack = track;  // Actualiza el track actual
        this.playTrack();  // Reproduce el track actual
      } else {
        this.stopTrack();  // Detén la reproducción si no hay track
      }
    });
  }
  

  ngOnDestroy() {
    // Aseguramos que la suscripción se desuscriba cuando el componente se destruya
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
  }

  playTrack() {
    if (this.currentTrack && this.currentTrack.audio) {
      const audio = new Audio(this.currentTrack.audio); // Crea un nuevo objeto Audio con la URL del track
      audio.play()
        .then(() => {
          this.isPlaying = true; // Cambia el estado de reproducción a 'true'
          console.log('Reproduciendo:', this.currentTrack.nombre); // Puedes loguear el nombre de la canción si lo deseas
        })
        .catch((error: any) => {
          console.error('Error al reproducir la canción', error);
        });
    } else {
      console.error('No se encontró la URL del track o track no válido:', this.currentTrack);
    }
  }
  


  stopTrack() {
    this.isPlaying = false;
    this.currentTrack = null;
    // Aquí agregarías la lógica para detener la reproducción
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite; // Cambiar entre favorito y no favorito
  }

  updateProgress() {
    const audioElement = this.audioElementRef.nativeElement;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', () => {
        this.currentTime = audioElement.currentTime;
        this.duration = audioElement.duration || 1;
        const progressPercent = (this.currentTime / this.duration) * 100;
        // Actualiza el valor de la variable --progress en CSS
        document.documentElement.style.setProperty('--progress', `${progressPercent}%`);
      });
    }
  }

  changeVolume() {
    if (this.player) {
      this.player.setVolume(this.volume / 100);
    }
  }


  prevTrack() {
    if (this.player) {
      this.player.previousTrack();
    }
  }

  nextTrack() {
    if (this.player) {
      this.player.nextTrack();
    }
  }

  // Aquí se agrega el método onTimeUpdate() que maneja el evento timeupdate del audio
  onTimeUpdate() {
    const audioElement = this.audioElementRef.nativeElement;
    if (audioElement) {
      this.currentTime = audioElement.currentTime;
      this.duration = audioElement.duration;
    }
  }

  togglePlay() {
    if (this.player) {
      this.player.togglePlay().then(() => {
        this.isPlaying = !this.isPlaying;  // Alternar el estado de la canción
        console.log(this.isPlaying ? 'Reproduciendo' : 'Pausado');
      }).catch((error: any) => {
        console.error('Error al alternar la canción', error);
      });
    }
  }

  seekTrack(event: any) {
    const newTime = event.target.value;
    if (this.audioElementRef && this.audioElementRef.nativeElement) {
      this.audioElementRef.nativeElement.currentTime = newTime;
      this.currentTime = newTime;
    }
  }

  

}
