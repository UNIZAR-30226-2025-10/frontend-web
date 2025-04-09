import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ProgressService } from '../../services/progress.service';
import { FavoritosService } from '../../services/favoritos.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';



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
  hayColeccion: boolean = false;

  isPlaying: boolean = false;
  isShuffle: boolean = false;

  private trackSubscription!: Subscription;
  private progressSubscription!: Subscription;
  private favSubscription!: Subscription;
  private playSubscription!: Subscription;
  private shuffleSubscription!: Subscription;

  currentTime: number = 0; // Tiempo actual de la canción
  duration: number = 0;

  volume: number = 50; //LUEGO SE COGE EL VOLUMEN QUE ME DEN AL INICIAR SESION
   
  isFavorite = false;
  screenWidth: number = window.innerWidth;

  //PARA MANEJAR CUANTO TIEMPO DE LA CANCION SE HA REPRODUCIDO
  secondsListened: number = 0;  // Segundos reales escuchados
  lastTime: number = 0;         // Último tiempo registrado para detectar adelantos

  constructor(private playerService: PlayerService, private authService:AuthService, private tokenService : TokenService, private progressService: ProgressService, private favoritosService: FavoritosService, private router: Router,private notificationService: NotificationService){}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth; 
  }


  ngOnInit() {
    console.log('haycoleccion:', this.hayColeccion)
    if (this.tokenService.getCancionActual() != null) {
      if (this.tokenService.getColeccionActual() != null) {
        this.hayColeccion = true;
        this.playerService.coleccionActual.id = this.tokenService.getColeccionActual().id
        this.playerService.coleccionActual.modo = this.tokenService.getColeccionActual().modo
        this.playerService.coleccionActual.orden = this.tokenService.getColeccionActual().orden
        this.playerService.coleccionActual.index = this.tokenService.getColeccionActual().index
        this.playerService.coleccionActual.ordenNatural = this.tokenService.getColeccionActual().ordenNatural
        if (this.playerService.coleccionActual.ordenNatural === null) {
          this.playerService.coleccionActual.ordenNatural = this.playerService.coleccionActual.orden;
        }

        if ( this.playerService.coleccionActual.modo === 'aleatorio') {
          this.playerService.toggleShuffleActivarForzado('musicplayer')
          this.isShuffle = true;
        }
        console.log('me devuelve en orden:', this.playerService.coleccionActual.orden)
        console.log('me devuelve en ordenNatural:', this.playerService.coleccionActual.ordenNatural)
        console.log('me devuelve en index:', this.playerService.coleccionActual.index)
        console.log('me devuelve en modo:', this.playerService.coleccionActual.modo)
      }
      this.currentTrack = this.tokenService.getCancionActual();
      this.playerService.trackIndividual = this.currentTrack;
      this.isPlaying = false;
      this.isFavorite = this.tokenService.getCancionActual().fav;
      this.secondsListened = Number(this.tokenService.getTranscursoCancion())
    }

    console.log("Valor inicial de currentTrack$:", this.playerService.currentTrackSource.getValue());



    // Nos suscribimos al observable para recibir el track actualizado
    this.trackSubscription = this.playerService.currentTrack$.subscribe(trackData => {
      if (trackData && trackData.track) {
        this.currentTrack = trackData.track; // Actualiza el track actual
        this.secondsListened = 0;
        this.lastTime = 0;
        if(!trackData.coleccion) {
          console.log('cancion sola track', trackData.track);
          console.log('cancion sola2', this.currentTrack.id);
          this.hayColeccion = false;
          this.playTrack();
        } else {
          console.log('coleccion que se reproduce', trackData.coleccion);
          console.log('cancion de la coleccion que se reproduce', trackData.track);
          this.hayColeccion = true;
          this.playTrackInCollection(trackData.coleccion);
        }
      }
    });

    // Nos suscribimos al observable para recibir el play/pause
    this.playSubscription = this.playerService.isPlaying$
    .subscribe(playData => {
      if (playData) {
        if (playData.emisor != 'musicplayer') {
          console.log('dentro evento play musicplayer', playData);
          this.isPlaying = playData.play;
        }
      }
    });

    // Nos suscribimos al observable para recibir el shuffle/no shuffle
    this.shuffleSubscription = this.playerService.isShuffle$
    .subscribe(shuffleData => {
      if (shuffleData) {
        if (shuffleData.emisor != 'musicplayer') {
          console.log('dentro evento shuffle musicplayer', shuffleData);
          this.isShuffle = shuffleData.shuffle;
        }
      }
    });

    // Nos suscribimos al observable para recibir si hay que actualizar el fav del marco.
    this.favSubscription = this.favoritosService.actualizarFav$
    .subscribe(favData => {
      if (favData && favData.actualizarFavId) {
        if (this.tokenService.getCancionActual() != null) {
          if(favData.actualizarFavId === this.tokenService.getCancionActual().id) {
            console.log('dentro evento fav', favData.actualizarFavId);
            this.actualizarFavMarco()
          }
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
    // Aseguramos que la suscripción se desuscriba cuando el componente se destruya
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }

    if (this.favSubscription) {
      this.favSubscription.unsubscribe();
    }

    if (this.playSubscription) {
      this.playSubscription.unsubscribe();
    }

    if (this.shuffleSubscription) {
      this.shuffleSubscription.unsubscribe();
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
          this.currentTrack.nombreUsuarioArtista = response.nombreUsuarioArtista;
          this.tokenService.setCancionActual(this.currentTrack);
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
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }


  playTrackInCollection(coleccion:any) {
    //CON ESTA PETICION SE MANDA AL BAKEND LA CANCION ACTUAL Y QUE ESTA EN UNA COLECCION
    this.authService.pedirCancionColeccion(coleccion.id, coleccion.modo, coleccion.orden, coleccion.index)
    .subscribe({
      next: (response) => {
        //Esta peticion devuelve el audio, si es fav, y el nombre du user del artista
        if (response && response.audio) {
        this.audioElementRef.nativeElement.src = response.audio;
        this.currentTrack.audio = this.audioElementRef.nativeElement.src;
        this.currentTrack.fav = response.fav;
        this.currentTrack.nombreUsuarioArtista = response.nombreUsuarioArtista;
        this.tokenService.setCancionActual(this.currentTrack);
        this.tokenService.setColeccionActual(coleccion);
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
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

  //Para boton de PLAY/PAUSE
  togglePlay() {

    if(this.audioElementRef.nativeElement.src && this.audioElementRef.nativeElement.src !== '') {
      if (!this.isPlaying) {  
        this.isPlaying = true;
      } else {
        this.isPlaying = false;
      }
      this.playerService.togglePlay('musicplayer')
    } 
  }

  prevTrack(): void {
    this.playerService.prevSong();  
  }

  nextTrack(): void {
    this.playerService.nextSong();  
  }

  toggleShuffle() : void {
    if (!this.isShuffle) {  
      this.isShuffle = true;
    } else {
      this.isShuffle = false;
    }
    this.playerService.toggleShuffle('musicplayer', this.isShuffle)
  }


  //PARA PONER BIEN EL VOLUMEN ANTES DE TOCAR LA BARRA
  setInitialVolumeProgress() {
    this.volume = this.tokenService.getUser().volumen;
    const volumeControl = document.querySelector('.barra_volumen') as HTMLInputElement;
    if (volumeControl) {
      const progressPercent = (this.volume / 100) * 100;
      volumeControl.style.background = `linear-gradient(to right, #8ca4ff ${progressPercent}%,var(--repro) ${progressPercent}%)`;
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

      let entero = Math.floor(this.currentTime); 
      if (entero != this.lastTime) {
        this.lastTime = entero;
        this.secondsListened++;
        this.tokenService.setTranscursoCancion(this.secondsListened)
      }
      if (this.secondsListened === 20){
        this.incrementSongPlayCount()
        this.secondsListened++;
      }
     
      const progressPercent = (this.currentTime / this.duration) * 100;
      const progressBar = document.querySelector('.progress-bar') as HTMLElement;
      if (progressBar) {
        progressBar.style.background = `linear-gradient(to right, #8ca4ff ${progressPercent}%,var(--repro) ${progressPercent}%)`;
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
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      }
    });
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
        volumeControl.style.background = `linear-gradient(to right, #8ca4ff ${progressPercent}%, var(--repro) ${progressPercent}%)`;
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
          // No esta logeado
          if (error.status === 401) {
            this.tokenService.clearStorage();
            this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); 
          }
        },
        complete: () => {
          console.log('Volumen actualizado con éxito');
        }
      });
    }
  }

  toggleFavorite() {
    
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
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
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
}
