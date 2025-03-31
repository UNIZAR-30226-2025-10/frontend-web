import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  currentTrackSource = new BehaviorSubject<{ track: any, coleccion:boolean } | null>(null);
  currentTrack$ = this.currentTrackSource.asObservable();

  public isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private esColeccion = false;
  private isShuffle = false;
  private currentIndex = 0;

  private songsSonando: any[] = [];
  private songListEnOrden: any[] = [];
  private songListAleatorio: any[] = [];

  private playedSongs: any[] = [];

  constructor( private tokenService: TokenService) {}

  //Para cuando se accede a una canción concreta, ya sea desde buscador, home, mi Perfil o album
  setTrack(track: any, coleccion:any =null): void {
    this.esColeccion = coleccion !== null;

    if (coleccion) {
      console.log('Reproduciendo desde colección:', coleccion);
      this.songsSonando = coleccion.canciones;
      this.currentIndex = this.songsSonando.findIndex(song => song.id === track.id);
      coleccion.canciones= this.songsSonando.map((c: { id: any }) => c.id);

    } else {
        console.log('Reproduciendo canción individual');
        this.songsSonando = [track];
        this.currentIndex = this.songsSonando.findIndex(song => song.id === track.id);
    }

  
    if (coleccion) coleccion.index = this.currentIndex;

    this.currentTrackSource.next({ track: this.songsSonando[this.currentIndex], coleccion})
    this.isPlayingSubject.next(true);

    setTimeout(() => {
      this.currentTrackSource.next(null);
    }, 500); 
  }

  //Cuando se reproducen desde el play general del album
  setColeccion(coleccion: any) {

    //La colección ya está sonando
    if(this.tokenService.getColeccionActual().id === coleccion.id) {
      return;
    }
   
    //La colección suena por primera vez
    this.songListEnOrden = coleccion.canciones;
    this.currentIndex = 0;
  
    // Si está activado el modo aleatorio, se genera un vector aleatorio
    if (this.isShuffle) {
      this.songListAleatorio = this.shuffleArray(this.songListEnOrden);
      this.setTrack(this.songListAleatorio[this.currentIndex], this.songListAleatorio);

    //Sino está el modo aleatorio, se pasa el vector ordenado
    } else {
      this.setTrack(this.songListEnOrden[this.currentIndex], this.songListEnOrden);
    }
  }
  
  
  nextSong(): void {
    if (this.songListEnOrden.length === 1) {
      this.currentTrackSource.next(this.songListEnOrden[this.currentIndex]); // Reproducir la misma canción en bucle
    } else {
      if (this.isShuffle) {
        //this.playRandomSong();
      } else {
        this.currentIndex = (this.currentIndex + 1) % this.songListEnOrden.length;  // Avanzar al siguiente índice
        const nextTrack = this.songListEnOrden[this.currentIndex];
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
      this.currentIndex = this.songListEnOrden.indexOf(prevTrack);  // Actualizar el índice de la canción anterior
      this.currentTrackSource.next(prevTrack);  // Reproducir la canción anterior
    } else {
      // Si solo hay una canción en la lista o no hay historial, reproducimos la canción actual
      const currentTrack = this.songListEnOrden[this.currentIndex]; // Obtener la canción actual
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



toggleShuffle(): void {
  this.isShuffle = !this.isShuffle;
}

isShuffleEnabled(): boolean {
  return this.isShuffle;
}

//Método que crea un vector de canciones aleatorias
shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

  
}

