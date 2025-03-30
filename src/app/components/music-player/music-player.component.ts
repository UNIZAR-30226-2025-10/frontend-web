import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
<<<<<<< Updated upstream
=======
import { ProgressService } from '../../services/progress.service';
import { FavoritosService } from '../../services/favoritos.service';
import { Router } from '@angular/router';

>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
=======
  private progressSubscription!: Subscription;
  private favSubscription!: Subscription;
>>>>>>> Stashed changes

  currentTime: number = 0; // Tiempo actual de la canción
  duration: number = 0;

  volume: number = 50; //COGER VOLUMEN QUE ME DEN AL INICIAR SESION
   
  isFavorite = false;
  screenWidth: number = window.innerWidth;

<<<<<<< Updated upstream
  constructor(private playerService: PlayerService, private authService:AuthService, private tokenService : TokenService){}
=======
  //PARA MANEJAR CUANTO TIEMPO DE LA CANCION SE HA REPRODUCIDO
  secondsListened: number = 0;  // Segundos reales escuchados
  lastTime: number = 0;         // Último tiempo registrado para detectar adelantos
  hasCalledAPI: boolean = false;  // Para evitar llamadas duplicadas a la API



  constructor(private playerService: PlayerService, private authService:AuthService, private tokenService : TokenService, private progressService: ProgressService, private favoritosService: FavoritosService, private router: Router){}
>>>>>>> Stashed changes

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth; 
  }

  //SUSCRIPCION A UN EVENTO PARA ACTUALIZAR LA BARRA CUANDO SE CAMBIA DE CANCIÓN
  ngOnInit() {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // Nos suscribimos al observable para recibir el track actualizado
    this.trackSubscription = this.playerService.currentTrack$.subscribe(track => {
      if (track) {
        this.currentTrack = track;  // Actualiza el track actual
        this.playTrack();  // Reproduce el track actual
=======

    this.socketService.connect();

    this.socketService.listen('put-cancion-sola-ws').subscribe(
      (data) => {
        console.log('Canción recibida:', data);
        this.songData = data; // Asignar los datos a songData

      },
      (error) => {
        console.error('Error al recibir evento:', error);
      }
    );

=======
    
>>>>>>> Stashed changes
    if(this.tokenService.getCancionActual() != null) {
      console.log('q tengo en local: ', this.tokenService.getCancionActual());
      this.currentTrack = this.tokenService.getCancionActual();
      this.isPlaying = false;
      this.playerService.isPlayingSubject.next(false);
      this.isFavorite = this.tokenService.getCancionActual().fav;
      console.log('isFavorite:', this.isFavorite);
    }

    console.log("Valor inicial de currentTrack$:", this.playerService.currentTrackSource.getValue());



    // Nos suscribimos al observable para recibir el track actualizado
<<<<<<< Updated upstream
    this.trackSubscription = this.playerService.currentTrack$.subscribe(track => {
      if (track) {
          this.currentTrack = track;
          console.log("llama playtrack");
          this.playTrack();
>>>>>>> Stashed changes
      } 
    });

=======
    this.trackSubscription = this.playerService.currentTrack$.subscribe(trackData => {
      if (trackData && trackData.track) {
        this.currentTrack = trackData.track; // Actualiza el track actual
        if(!trackData.coleccion) {
          this.playTrack();
        } else {
          this.playTrackInCollection();
        }
      }
    });

    // Nos suscribimos al observable para recibir si hay que actualizar el fav del marco.
    this.favSubscription = this.favoritosService.actualizarFav$
    .subscribe(favData => {
      if (favData && favData.actualizarFavId) {
       if(favData.actualizarFavId === this.tokenService.getCancionActual().id) {
        console.log('dentro evento fav', favData.actualizarFavId);
        this.actualizarFavMarco()
       }
      }
    });
    
    
>>>>>>> Stashed changes
    this.setInitialVolumeProgress();

    setInterval(() => {
      this.updateDuration();
    }, 500);
  }
  

  updateDuration() {
    const audio = this.audioElementRef.nativeElement;
  
    // Verificamos si la duración es válida
    if (audio && !isNaN(audio.duration) && audio.duration > 0) {
      this.duration = audio.duration;
    }
  }

  ngOnDestroy() {
    // Aseguramos que la suscripción se desuscriba cuando el componente se destruya
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
<<<<<<< Updated upstream
=======
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }

    if (this.favSubscription) {
      this.favSubscription.unsubscribe();
    }
>>>>>>> Stashed changes
  }
  

  stopTrack() {
    this.isPlaying = false;
    this.currentTrack = null;
    // Aquí agregarías la lógica para detener la reproducción
  }


  //PETICION PARA COGER EL AUDIO DE LA NUEVA CANCION CUANDO SE PULSA EN ELLA
  playTrack() {
    //MANDARLE AL BACKEND LA NUEVA CANCION ACTUAL
    //pasarle this.currentTrack.id y esto me devuelve el audio
    this.authService.pedirCancion()
    .subscribe({
      next: (response) => {
<<<<<<< Updated upstream
=======
        //Esta peticion devuelve el audio, si es fav, y el nombre du user del artista
        if (response && response.audio) {
          this.audioElementRef.nativeElement.src = response.audio;
          this.currentTrack.audio = this.audioElementRef.nativeElement.src;
          this.currentTrack.fav = response.fav;
          this.tokenService.setCancionActual(this.currentTrack);
          console.log('que guardo', this.currentTrack );
          this.audioElementRef.nativeElement.play();
          this.isPlaying = true;
          this.isFavorite = response.fav;
          console.log('Reproduciendo:', this.currentTrack.nombre);

          //ACTUAR CON LO QUE DEVUELVE EL SOCKET

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

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  playTrackInCollection() {
    //CON ESTA PETICION SE MANDA AL BAKEND LA CANCION ACTUAL Y QUE ESTA EN UNA COLECCION
    this.authService.pedirCancionColeccion(this.currentTrack.id)
    .subscribe({
      next: (response) => {
        //Esta peticion devuelve el audio, si es fav, y el nombre du user del artista
>>>>>>> Stashed changes
        if (response && response.audio) {
        this.audioElementRef.nativeElement.src = response.audio;
        this.audioElementRef.nativeElement.play();
        this.isPlaying = true;
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
<<<<<<< Updated upstream
    const audio = this.audioElementRef.nativeElement;
    if (audio.paused) {
      audio.play();
      this.isPlaying = true;
    } else {
      audio.pause();
      this.isPlaying = false;
    }
    //MANDAR AL BACKEND CUANDO HAGO PAUSA
=======

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
    } 
>>>>>>> Stashed changes
  }

  prevTrack(){

  }

  nextTrack(){
    
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
      this.duration = audioElement.duration; // Se actualiza cuando el audio carga
    });

    audioElement.addEventListener('timeupdate', () => {
      this.currentTime = audioElement.currentTime;
      this.duration = audioElement.duration; // Asegurar que siempre tenga valor

      // Verifica si se ha adelantado la canción (comparando con el último tiempo)
      if (this.currentTime < this.lastTime) {
        // Si el tiempo actual es menor que el anterior, significa que el usuario ha adelantado
        this.secondsListened = 0; // Reiniciar el contador de tiempo escuchado
        this.hasCalledAPI = false; // Reiniciar la flag para evitar llamadas duplicadas
      }
      // Actualizar el último tiempo
      this.lastTime = this.currentTime;

      const progressPercent = (this.currentTime / this.duration) * 100;
      const progressBar = document.querySelector('.progress-bar') as HTMLElement;
      if (progressBar) {
        progressBar.style.background = `linear-gradient(to right, #8ca4ff ${progressPercent}%, #000e3b ${progressPercent}%)`;
      }

      // Si el usuario ha escuchado 20 segundos completos, llamamos a la API
      if (this.currentTime >= 20 && !this.hasCalledAPI) {
        this.hasCalledAPI = true;
        this.incrementSongPlayCount();
      }

    });
  }
  }

  incrementSongPlayCount() {
    this.authService.incrementarReproduccionesCancion()
    .subscribe({
      next: () => {
        console.log('Reproducción registrada');
      },
      error: (error) => {
        console.error('Error al registrar la reproducción:', error);
      }
    });
  }
  

  //PARA PROGRESO DE LA BARRA Y EL TIEMPO
  onTimeUpdate() {
    const audioElement = this.audioElementRef.nativeElement;
  if (audioElement) {
    this.currentTime = audioElement.currentTime;
    //this.duration = audioElement.duration;
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
<<<<<<< Updated upstream
    this.isFavorite = !this.isFavorite; // Cambiar entre favorito y no favorito
    //MNADAR AL BACKEND
  }


=======
    
    this.authService.favoritos(this.tokenService.getCancionActual().id, !this.isFavorite)
    .subscribe({
      next: () => {
        this.isFavorite = !this.isFavorite;
        const cancionActual = this.tokenService.getCancionActual();
        cancionActual.fav = this.isFavorite;
        this.tokenService.setCancionActual(cancionActual);
        console.log('fav:', this.tokenService.getCancionActual().fav);
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

  actualizarFavMarco() {
    const cancionActual = this.tokenService.getCancionActual();
    this.isFavorite = !cancionActual.fav;
    console.log('dentro funcion:', this.isFavorite)
    cancionActual.fav = this.isFavorite;
    this.tokenService.setCancionActual(cancionActual);
  }

  onSongEnd(): void {
    console.log("Canción terminada, pasando a la siguiente...");
    this.playerService.nextSong();
  }

  goPantallaArtista() {
    this.router.navigate(['/home/artista', this.currentTrack.nombreUsuarioArtista]);
  }
>>>>>>> Stashed changes
}
