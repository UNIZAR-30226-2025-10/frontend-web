import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ProgressService } from '../../services/progress.service';


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
  private progressSubscription!: Subscription;

  currentTime: number = 0; // Tiempo actual de la canción
  duration: number = 0;

  volume: number = 50; //COGER VOLUMEN QUE ME DEN AL INICIAR SESION
   
  isFavorite = false;
  screenWidth: number = window.innerWidth;

  constructor(private playerService: PlayerService, private authService:AuthService, private tokenService : TokenService, private progressService: ProgressService){}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth; 
  }

  //SUSCRIPCION A UN EVENTO PARA ACTUALIZAR LA BARRA CUANDO SE CAMBIA DE CANCIÓN
  ngOnInit() {

    if(this.tokenService.getCancionActual() != null) {
      console.log('q tengo en local: ', this.tokenService.getCancionActual());
      this.currentTrack = this.tokenService.getCancionActual();
      this.isPlaying = false;
      this.playerService.isPlayingSubject.next(false);
      this.isFavorite = this.tokenService.getCancionActual().fav;
    }


    // Nos suscribimos al observable para recibir el track actualizado
    this.trackSubscription = this.playerService.currentTrack$.subscribe(track => {
      if (track) {
        this.currentTrack = track;  // Actualiza el track actual
        if (this.currentTrack.modo === "enBucle") {
          this.playTrack(); 
        } else {
          this.playTrackInCollection();
        }     
      } 
    });

    this.setInitialVolumeProgress();

    setInterval(() => {
      this.updateDuration();
    }, 500);

  }

  ngAfterViewInit() {
    if (this.audioElementRef && this.audioElementRef.nativeElement) {
      this.audioElementRef.nativeElement.src = this.tokenService.getCancionActual().audio;
      this.audioElementRef.nativeElement.currentTime = this.tokenService.getProgresoLocal();


      //if: para cuando la cancion no viene de pulsar, sino entre sesiones o al refrescar
      if (this.tokenService.getCancionActual().modo === "enBucle") {
        this.audioElementRef.nativeElement.loop = true;
      } else {
        this.audioElementRef.nativeElement.addEventListener('ended', () => {
          this.onSongEnd();
        });
      }
    }
  }
  

  updateDuration() {
    const audio = this.audioElementRef.nativeElement;
  
    // Verificamos si la duración es válida
    if (audio && !isNaN(audio.duration) && audio.duration > 0) {
      this.duration = audio.duration;
    }else {
      this.duration = 0; // O cualquier otro valor por defecto
    }
  }

  ngOnDestroy() {
    // Aseguramos que la suscripción se desuscriba cuando el componente se destruya
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }
  

  stopTrack() {
    this.isPlaying = false;
    this.currentTrack = null;
    // Aquí agregarías la lógica para detener la reproducción
  }


  //PETICION PARA COGER EL AUDIO DE LA NUEVA CANCION CUANDO SE PULSA EN ELLA Y MANDARLE AL BACKEND QUE SE ESTA ESCUCHANDO ESA CACNION
  playTrack() {
    //CON ESTA PETICION SE MANDA AL BAKEND LA CANCION ACTUAL Y QUE ESTA SOLA, NO EN COLECCION
    this.authService.pedirCancionSola(this.currentTrack.id)
    .subscribe({
      next: (response) => {
        //Esta peticion devuelve el audio, si es fav, y el nombre du user del artista
        if (response && response.audio) {
        this.audioElementRef.nativeElement.src = response.audio;
        this.audioElementRef.nativeElement.play();
        this.isPlaying = true;
        this.isFavorite = response.fav;
        console.log('Reproduciendo:', this.currentTrack.nombre);
      } else {
        console.error('No se pudo obtener el audio de la canción');
      }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

  playTrackInCollection() {
    //CON ESTA PETICION SE MANDA AL BAKEND LA CANCION ACTUAL Y QUE ESTA EN UNA COLECCION
    this.authService.pedirCancionColeccion(this.currentTrack.id)
    .subscribe({
      next: (response) => {
        //Esta peticion devuelve el audio, si es fav, y el nombre du user del artista
        if (response && response.audio) {
        this.audioElementRef.nativeElement.src = response.audio;
        this.audioElementRef.nativeElement.play();
        this.isPlaying = true;
        this.isFavorite = response.fav;
        console.log('Reproduciendo:', this.currentTrack.nombre);
      } else {
        console.error('No se pudo obtener el audio de la canción');
      }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

  //Para boton de PLAY/PAUSE
  togglePlay() {

    if(this.audioElementRef.nativeElement.src && this.audioElementRef.nativeElement.src !== '') {
      const audio = this.audioElementRef.nativeElement;
      if (audio.paused) {
        audio.play();
        this.isPlaying = true;
        this.playerService.isPlayingSubject.next(true);
      } else {
        audio.pause();
        this.isPlaying = false;
        this.playerService.isPlayingSubject.next(false);
      }
      //MANDAR AL BACKEND CUANDO HAGO PAUSA
    } 
  }

  prevTrack(): void {
    this.playerService.prevSong();  
  }

  nextTrack(): void {
    this.playerService.nextSong();  
  }

  //PARA PONER BIEN EL VOLUMEN ANTES DE TOCAR LA BARRA
  setInitialVolumeProgress() {
    const volumeControl = document.querySelector('.barra_volumen') as HTMLInputElement;
    if (volumeControl) {
      const progressPercent = (this.volume / 100) * 100;
      volumeControl.style.background = `linear-gradient(to right, #8ca4ff ${progressPercent}%, #000E3B ${progressPercent}%)`;
    }
  }

  //PARA PROGRESO DE LA BARRA Y EL TIEMPO
  updateProgress() {
    const audioElement = this.audioElementRef.nativeElement;
  if (audioElement) {
    audioElement.addEventListener('loadedmetadata', () => {
      this.duration = !isNaN(audioElement.duration) ? audioElement.duration : 0;  // Se actualiza cuando el audio carga
    });

    audioElement.addEventListener('timeupdate', () => {
      this.currentTime = audioElement.currentTime;
      this.duration = !isNaN(audioElement.duration) ? audioElement.duration : 0; // Asegurar que siempre tenga valor

      const progressPercent = (this.currentTime / this.duration) * 100;

      const progressBar = document.querySelector('.progress-bar') as HTMLElement;
      if (progressBar) {
        progressBar.style.background = `linear-gradient(to right, #8ca4ff ${progressPercent}%, #000e3b ${progressPercent}%)`;
      }

    });
  }
  }

  //PARA PROGRESO DE LA BARRA Y EL TIEMPO
  onTimeUpdate() {
    const audioElement = this.audioElementRef.nativeElement;
    if (audioElement) {
      this.currentTime = audioElement.currentTime;
      this.tokenService.setProgresoLocal(this.currentTime);
    }
  }

  //PARA CUANDO DE MUEVE EL TIEMPO DE LA CACNION MANUALMENTE
  seekTrack(event: any) {
    const newTime = event.target.value;
    if (this.audioElementRef && this.audioElementRef.nativeElement) {
      this.audioElementRef.nativeElement.currentTime = newTime;
      this.currentTime = newTime;
    }
  } 

  //PASAR TIEMPO A FORMATO MINUTO:SEGUNDO
  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60); // Obtener minutos
    const remainingSeconds = Math.floor(seconds % 60); // Obtener segundos restantes
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  }


  changeVolume() {
    const audio = this.audioElementRef.nativeElement;
    if (audio) {
      audio.volume = this.volume / 100;

      const volumeControl = document.querySelector('.barra_volumen') as HTMLInputElement;
      if (volumeControl) {
        const progressPercent = (this.volume / 100) * 100;
        volumeControl.style.background = `linear-gradient(to right, #8ca4ff ${progressPercent}%, #000E3B ${progressPercent}%)`;
      }

      //MANDAR AL BACKEND EL NUEVO VOLUMEN
    }
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    const cancionActual = this.tokenService.getCancionActual();
    cancionActual.fav = this.isFavorite;
    this.tokenService.setCancionActual(cancionActual);
    this.authService.favoritos(this.tokenService.getCancionActual().id, this.isFavorite)
    .subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

  onSongEnd(): void {
    console.log("Canción terminada, pasando a la siguiente...");
    this.playerService.nextSong();
  }
  
}
