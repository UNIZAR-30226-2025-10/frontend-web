import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';


interface Coleccion {
  id: string;
  modo: string;
  orden: any[];
  index: number;
  ordenNatural: any[]
}

interface Track {
  id: string;
  nombre: string;
  nombreArtisticoArtista: string;
  fotoPortada: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  currentTrackSource = new BehaviorSubject<{ track: any, coleccion:any } | null>(null);
  currentTrack$ = this.currentTrackSource.asObservable();

  public isPlayingSubject = new BehaviorSubject<{play: boolean, emisor: string} | null>(null);
  isPlaying$ = this.isPlayingSubject.asObservable();

  public isShuffleSubject = new BehaviorSubject<{shuffle: boolean, emisor: string} | null>(null);
  isShuffle$ = this.isShuffleSubject.asObservable();

  private esColeccion = false;
  
  trackIndividual: any;
  coleccionActual: Coleccion = { id: '', modo: '', orden: [], index:0, ordenNatural: []} ;

  constructor( private tokenService: TokenService, private authService: AuthService) {}

  //Cuando accedo desde fuera de una colección: track es de tipo Track
  //Cuando accedo desde una colección: track es un id y listaColeccion es una lista de ids en cierto orden
  setTrack(track: any, listaColeccion:any =null): void {
    this.esColeccion = listaColeccion !== null;

    if (this.esColeccion) {
      console.log('Reproduciendo desde colección:');
      this.trackIndividual = null;
      
      this.coleccionActual.index = listaColeccion.findIndex((id: any) => id === track);

      this.authService.pedirOtraCancion(track)
      .subscribe({
        next: (response) => { 
          const currentTrack: Track = {
            nombre: response.nombre,
            nombreArtisticoArtista: response.nombreArtisticoArtista,
            fotoPortada: response.fotoPortada,
            id: track
          };
          this.currentTrackSource.next({ track: currentTrack, coleccion: this.coleccionActual});
        },
        error: (error) => {
          console.error("Error al recibir los datos de la canción", error);
        },
        complete: () => {
          console.log("Datos recibidos con éxito");
        }
      });
    } else {
        if (this.tokenService.getColeccionActual() != null) {
          this.tokenService.setColeccionActual(null)
        }
        console.log('Reproduciendo canción individual');
        this.trackIndividual = track;

        this.coleccionActual.id = '';
        this.coleccionActual.modo = '';
        this.coleccionActual.orden = [];
        this.coleccionActual.index = 0;
        this.currentTrackSource.next({ track: track, coleccion: null})

        this.isPlayingSubject.next({play:true, emisor: 'pantalla'});
    }

    

    setTimeout(() => {
      this.currentTrackSource.next(null);
    }, 500); 
  }

  //Cuando se reproducen desde el play general del album
  setColeccion(idColeccion:string, coleccion: any, isShuffle: boolean) {

    //La colección ya está sonando
    if(this.tokenService.getColeccionActual() != null && this.tokenService.getColeccionActual().id.toString() === idColeccion) {
      console.log('return')
      return;
    }
   
    //La colección suena por primera vez
    this.coleccionActual.id = idColeccion;
    this.coleccionActual.index = 0;
    const songListEnOrden = coleccion.map((song: { id: any; }) => song.id);
    this.coleccionActual.ordenNatural = songListEnOrden;
  
    // Si está activado el modo aleatorio, se genera un vector aleatorio
    if (isShuffle) {
      const songListAleatorio = this.shuffleArray(songListEnOrden);
      this.coleccionActual.modo = 'aleatorio';
      this.coleccionActual.orden = songListAleatorio;
      this.setTrack(songListAleatorio[this.coleccionActual.index], songListAleatorio);

    //Sino está el modo enOrden, se pasa el vector ordenado
    } else {
      this.isShuffleSubject.next({shuffle: false, emisor: 'pantalla'});
      this.coleccionActual.modo = 'enOrden';
      this.coleccionActual.orden = songListEnOrden;
      this.setTrack(songListEnOrden[this.coleccionActual.index], songListEnOrden);
    }
  }
  
  
  nextSong(): void {
    console.log('en next song')
    if (this.coleccionActual.orden.length === 0) {
      console.log('en next song en individual')

      this.authService.pedirOtraCancion(this.trackIndividual.id)
      .subscribe({
        next: (response) => { 
          const nextTrack: Track = {
            nombre: response.nombre,
            nombreArtisticoArtista: response.nombreArtisticoArtista,
            fotoPortada: response.fotoPortada,
            id: this.trackIndividual.id
          };
          this.currentTrackSource.next({ track: nextTrack, coleccion: null}); // Reproducir la misma canción en bucle
        },
        error: (error) => {
          console.error("Error al recibir los datos de la canción", error);
        },
        complete: () => {
          console.log("Datos recibidos con éxito");
        }
      });
 
    } else {

        if (this.isPlayingSubject.getValue() === null) {
          console.log('envento forzado')
          this.isPlayingSubject.next({play:true, emisor: 'musicplayer'});
        }

        this.coleccionActual.index = (this.coleccionActual.index + 1) % this.coleccionActual.orden.length;
        console.log('index',  this.coleccionActual.index)

        this.authService.pedirOtraCancion(this.coleccionActual.orden[this.coleccionActual.index])
        .subscribe({
          next: (response) => { 
            const nextTrack: Track = {
              nombre: response.nombre,
              nombreArtisticoArtista: response.nombreArtisticoArtista,
              fotoPortada: response.fotoPortada,
              id: this.coleccionActual.orden[this.coleccionActual.index]
            };
            this.currentTrackSource.next({track: nextTrack, coleccion:this.coleccionActual});
          },
          error: (error) => {
            console.error("Error al recibir los datos de la canción", error);
          },
          complete: () => {
            console.log("Datos recibidos con éxito");
          }
        }); 
    }
  }
  

  prevSong(): void {
    //Es una cancion sola
    if (this.coleccionActual.orden.length === 0) {
      this.authService.pedirOtraCancion(this.trackIndividual.id)
        .subscribe({
          next: (response) => { 
            const currentTrack: Track = {
              nombre: response.nombre,
              nombreArtisticoArtista: response.nombreArtisticoArtista,
              fotoPortada: response.fotoPortada,
              id: this.trackIndividual.id
            };
            this.currentTrackSource.next({ track: currentTrack, coleccion: null});
          },
          error: (error) => {
            console.error("Error al recibir los datos de la canción", error);
          },
          complete: () => {
            console.log("Datos recibidos con éxito");
          }
        });
    } else {
      //Es la primera, no hay ninguna detrás
      if (this.coleccionActual.index === 0) {
        this.coleccionActual.index = (this.coleccionActual.orden.length -1)
        
        this.authService.pedirOtraCancion(this.coleccionActual.orden[this.coleccionActual.index])
        .subscribe({
          next: (response) => { 
            const currentTrack: Track = {
              nombre: response.nombre,
              nombreArtisticoArtista: response.nombreArtisticoArtista,
              fotoPortada: response.fotoPortada,
              id: this.coleccionActual.orden[this.coleccionActual.index]
            };
            this.currentTrackSource.next({track: currentTrack, coleccion:this.coleccionActual});
          },
          error: (error) => {
            console.error("Error al recibir los datos de la canción", error);
          },
          complete: () => {
            console.log("Datos recibidos con éxito");
          }
        });
      } else {
        this.coleccionActual.index = (this.coleccionActual.index- 1) % this.coleccionActual.orden.length;
  
        this.authService.pedirOtraCancion(this.coleccionActual.orden[this.coleccionActual.index])
        .subscribe({
          next: (response) => { 
            const prevTrack: Track = {
              nombre: response.nombre,
              nombreArtisticoArtista: response.nombreArtisticoArtista,
              fotoPortada: response.fotoPortada,
              id: this.coleccionActual.orden[this.coleccionActual.index]
            };
            this.currentTrackSource.next({track: prevTrack, coleccion:this.coleccionActual});
          },
          error: (error) => {
            console.error("Error al recibir los datos de la canción", error);
          },
          complete: () => {
            console.log("Datos recibidos con éxito");
          }
        });
      }
    }
  }



togglePlay(emisor: string): void {
  const audioElement = document.querySelector('audio'); 
  console.log('nuevo evento play')
  if (audioElement) {
    if (audioElement.paused) {
      audioElement.play();
      this.isPlayingSubject.next({play:true, emisor: emisor});
    } else {
      audioElement.pause();
      this.isPlayingSubject.next({play:false, emisor: emisor});
    }
  }
}

toggleShuffle(emisor: string, isShuffle: boolean): void {

  //El modo pasa a ser aleatorio
  if(isShuffle) {
    console.log('ALEATORIO')
    const idCancionSonando =  this.coleccionActual.orden[this.coleccionActual.index]

    let nuevoOrden = this.shuffleArray(
      this.coleccionActual.ordenNatural.filter(id => id !== idCancionSonando)
    );
    nuevoOrden.unshift(idCancionSonando);

    this.coleccionActual.orden = nuevoOrden;
    console.log('nuevo orden:', this.coleccionActual.orden)
    this.coleccionActual.index = 0;
    this.coleccionActual.modo = 'aleatorio';

  //El modo pasa a ser enOrden
  } else {
    console.log('ORDENADO')
    const idCancionSonando =  this.coleccionActual.orden[this.coleccionActual.index]
    this.coleccionActual.orden = this.coleccionActual.ordenNatural;
    console.log('nuevo orden:', this.coleccionActual.orden)
    const indice = this.coleccionActual.orden.findIndex(item => item === idCancionSonando);
    console.log('indice calculado:', indice)
    this.coleccionActual.index = indice;
    this.coleccionActual.modo = 'enOrden';

  }

  //Guardar en backend
  this.authService.cambiarModo(this.coleccionActual.modo, this.coleccionActual.orden, this.coleccionActual.index)
    .subscribe({
      next: () => { 
        if (this.coleccionActual.modo === 'aleatorio') {
          this.isShuffleSubject.next({shuffle:true, emisor: emisor});
        } else {
          this.isShuffleSubject.next({shuffle:false, emisor: emisor});
        }
      },
      error: (error) => {
        console.error("Error al cambiar el modo", error);
      },
      complete: () => {
        console.log("Modo cambiado con éxito");
      }
    });

  //Guardar en localStorage
  this.tokenService.setColeccionActual(this.coleccionActual)
}

toggleShuffleActivarForzado(emisor: string): void {
  this.isShuffleSubject.next({shuffle:true, emisor: emisor});
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

setTrackInCollection(idColeccion: string, idCancion: any, listaIds: any[]): void{

  if(this.coleccionActual.id != idColeccion) {
    this.coleccionActual.id = idColeccion;
    this.coleccionActual.index = 0;
    this.coleccionActual.modo = 'enOrden'
    this.coleccionActual.orden = listaIds
    this.coleccionActual.ordenNatural = listaIds
  }

  this.setTrack(idCancion, listaIds)
}

}

  


