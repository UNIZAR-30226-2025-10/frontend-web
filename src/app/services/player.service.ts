import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentTrackSource = new BehaviorSubject<any>(null);
  currentTrack$ = this.currentTrackSource.asObservable();

  public isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private isShuffle = false;
  private currentIndex = 0;
  private songList: any[] = [];
  private playedSongs: any[] = [];

  constructor( private tokenService: TokenService) {}
/*
  setTrack(track: any) {
    this.songList = [track]; 
    this.currentIndex = 0; 
    this.playedSongs = [];
    this.playedSongs.push(track);
    this.currentTrackSource.next(this.songList[this.currentIndex]);
  }*/

  //Para cuando se accede a una canción concreta, ya sea desde buscador, home, mi Perfil o album
  setTrack(track: any, songList: any[] = []): void {

    // Si se pasa una lista de canciones, se establece como el nuevo contexto
    this.songList = songList.length > 0 ? songList : [track]; // Si se pasa una lista, la usamos, si no solo usamos la canción seleccionada
    this.currentIndex = this.songList.findIndex(song => song === track); // Establecer el índice correcto
    this.playedSongs = [];
    this.playedSongs.push(track);

    const modifiedTrack = {
      ...this.songList[this.currentIndex],
      modo: "enBucle"
    };

    //GUARDAR CANCION ACTUAL EN LOCAL STORAGE
    this.tokenService.setCancionActual(modifiedTrack);
    
    this.currentTrackSource.next(modifiedTrack); // Emitir la canción actual
    this.isPlayingSubject.next(true);
  }

  //Cuando se reproducen desde el play general del album
  setAlbum(album: any) {
    this.songList = album.canciones; // Guardamos la lista de canciones
    this.currentIndex = 0; // Reiniciamos el índice
    this.playedSongs = [];
  
    if (this.isShuffle) {
      this.playRandomSong(); // Si está activado el modo aleatorio, empieza con una canción aleatoria
    } else {
      const modifiedTrack = {
        ...this.songList[this.currentIndex],
        modo: "enOrden"
      };
      this.playedSongs.push(modifiedTrack);
      this.currentTrackSource.next(modifiedTrack); // Si no, empieza con la primera canción
    }
  }
  
  
  nextSong(): void {
    if (this.songList.length === 1) {
      this.currentTrackSource.next(this.songList[this.currentIndex]); // Reproducir la misma canción en bucle
    } else {
      if (this.isShuffle) {
        this.playRandomSong();
      } else {
        this.currentIndex = (this.currentIndex + 1) % this.songList.length;  // Avanzar al siguiente índice
        const nextTrack = this.songList[this.currentIndex];
        nextTrack.modo = "enOrden";
        this.playedSongs.push(nextTrack); 
        this.currentTrackSource.next(nextTrack);
      }
    }
  }

  prevSong(): void {
    if (this.playedSongs.length > 1) { // Aseguramos que haya canciones previas para ir hacia atrás
      // Eliminar la última canción reproducida del historial
      this.playedSongs.pop();
      const prevTrack = this.playedSongs[this.playedSongs.length - 1];  // Obtener la canción anterior
      if (this.isShuffle) {
        prevTrack.modo = "aleatorio";
      } else {
        prevTrack.modo = "enOrden";
      }
      this.currentIndex = this.songList.indexOf(prevTrack);  // Actualizar el índice de la canción anterior
      this.currentTrackSource.next(prevTrack);  // Reproducir la canción anterior
    } else {
      // Si solo hay una canción en la lista o no hay historial, reproducimos la canción actual
      const currentTrack = this.songList[this.currentIndex]; // Obtener la canción actual
      if (currentTrack.modo != "enBucle") {
        if (this.isShuffle) {
          currentTrack.modo = "aleatorio";
        } else {
          currentTrack.modo = "enOrden";
        }
      }
      this.currentTrackSource.next(currentTrack);  // Reproducir la canción actual
      console.log('No hay canciones anteriores para reproducir, repitiendo la canción actual');
    }
}

togglePlay(): void {
  const audioElement = document.querySelector('audio'); 
  if (audioElement) {
    if (audioElement.paused) {
      audioElement.play();
      this.isPlayingSubject.next(true);
    } else {
      audioElement.pause();
      this.isPlayingSubject.next(false);
    }
  }
}



playRandomSong(): void {
  // Filtramos las canciones que aún no se han reproducido
  const remainingSongs = this.songList.filter(song => !this.playedSongs.includes(song));

  if (remainingSongs.length === 0) {
    // Si ya se han reproducido todas las canciones, reiniciamos el ciclo
    this.playedSongs = []; // Reiniciamos el historial
  }

  // Elegimos una canción aleatoria de las que quedan por escuchar
  const randomIndex = Math.floor(Math.random() * remainingSongs.length);
  const selectedSong = remainingSongs[randomIndex];

  selectedSong.modo = "aleatorio";
 
  this.playedSongs.push(selectedSong); // Añadimos la canción al historial
  this.currentTrackSource.next(selectedSong); // Emitimos la canción
}

toggleShuffle(): void {
  this.isShuffle = !this.isShuffle;
}

isShuffleEnabled(): boolean {
  return this.isShuffle;
}
  
}

