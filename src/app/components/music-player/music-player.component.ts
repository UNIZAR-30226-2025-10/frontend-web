import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ProgressService } from '../../services/progress.service';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})


export class MusicPlayerComponent implements OnInit, OnDestroy {

  songData: any;

  @ViewChild('audioElement') audioElementRef!: ElementRef<HTMLAudioElement>; 
  currentTrack: any = null;


  isPlaying: boolean = false;
  private trackSubscription!: Subscription;
  private progressSubscription!: Subscription;

  currentTime: number = 0; // Tiempo actual de la canción
  duration: number = 0;

  volume: number = 50; //LUEGO SE COGE EL VOLUMEN QUE ME DEN AL INICIAR SESION
   
  isFavorite = false;
  screenWidth: number = window.innerWidth;

  constructor(private playerService: PlayerService, private authService:AuthService, private tokenService : TokenService, private progressService: ProgressService, private socketService: SocketService){}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth; 
  }


  ngOnInit() {

    this.socketService.connect();
    
    this.socketService.listen('put-cancion-sola-ws').subscribe(
      (data) => {
        console.log('Canción recibida:', data);
        this.songData = data;
        this.playerService.setTrack(data.cancion, [], true);
      },
      (error) => {
        console.error('Error al recibir evento:', error);
      }
    );

    this.socketService.listen('play-pause-ws').subscribe(
      (data) => {
        console.log('Evento recibido en cliente:', data);
      },
      (error) => {
        console.error('Error al recibir evento:', error);
      }
    );
    

    if(this.tokenService.getCancionActual() != null) {
      console.log('q tengo en local: ', this.tokenService.getCancionActual());
      this.currentTrack = this.tokenService.getCancionActual();
      this.isPlaying = false;
      this.playerService.isPlayingSubject.next(false);
      this.isFavorite = this.tokenService.getCancionActual().fav;
    }

    console.log("Valor inicial de currentTrack$:", this.playerService.currentTrackSource.getValue());



    // Nos suscribimos al observable para recibir el track actualizado
    this.trackSubscription = this.playerService.currentTrack$.subscribe(trackData => {
      if (trackData && trackData.track) {
        this.currentTrack = trackData.track; // Actualiza el track actual
        console.log("Llamado desde socket:", trackData.fromSocket);
    
        if (trackData.fromSocket) {
          console.log("llama playReceptor");
          this.playReceptor();
        } else {
          console.log("llama playTrack");
          this.playTrack();
        }
      }
    });
    
    
    this.setInitialVolumeProgress();

    setInterval(() => {
      this.updateDuration();
    }, 500);

  }

  ngAfterViewInit() {
    if(this.currentTrack != null) {
      if (this.audioElementRef && this.audioElementRef.nativeElement) {
        const audioElement = this.audioElementRef.nativeElement;
  
    
      if (audioElement.src !== this.tokenService.getCancionActual().audio) {
        audioElement.src = this.tokenService.getCancionActual().audio;
      }
  
      audioElement.currentTime = this.tokenService.getProgresoLocal();
      
      audioElement.addEventListener('ended', () => {
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
    this.socketService.disconnect();
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
          this.currentTrack.audio = this.audioElementRef.nativeElement.src;
          this.currentTrack.fav = response.fav;
          this.tokenService.setCancionActual( this.currentTrack);
          console.log('que guardo', this.currentTrack );
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


  playReceptor() {
    if (this.songData && this.songData.cancion) {
      const cancion = this.songData.cancion;
  
      // Actualizar correctamente this.currentTrack antes de asignar el audio
      this.currentTrack = { ...cancion };
  
      // Asegurar que el audio se actualiza antes de reproducir
      this.audioElementRef.nativeElement.pause(); // Detener el audio actual
      this.audioElementRef.nativeElement.src = this.currentTrack.audio;
      this.audioElementRef.nativeElement.load(); // Forzar al navegador a recargar la nueva fuente
  
      this.tokenService.setCancionActual(this.currentTrack);
      this.isFavorite = this.currentTrack.fav ?? false;
  
      // Intentar reproducir y manejar errores de autoplay
      const playPromise = this.audioElementRef.nativeElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            console.log('Reproduciendo desde socket:', this.currentTrack.nombre);
          })
          .catch(error => {
            console.warn('Reproducción bloqueada por el navegador. Se requiere interacción del usuario.');
          });
      }
    } else {
      console.error('No se pudo obtener la canción desde el socket');
    }
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
      this.authService.playPause(!audio.paused, this.tokenService.getProgresoLocal())
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error en la petición:', error);
        },
        complete: () => {
          console.log('Petición completada');
        }
      });
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
    this.volume = this.tokenService.getUser().volumen;
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

      //Actualizamos el volumen en local storage
      const user = this.tokenService.getUser();
      user.volumen = this.volume; 
      this.tokenService.setUser(user);

      //Actualizamos el volumen en la bd
      this.authService.actualizarVolumen(this.volume)
      .subscribe({
        next: () => {
        },
        error: (error) => {
          console.error('Error al actualizar el volumen:', error);
        },
        complete: () => {
          console.log('Volumen actualizado con éxito');
        }
      });
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
