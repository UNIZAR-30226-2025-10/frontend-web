import { Component, OnInit,  ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { FavoritosService } from '../../services/favoritos.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

interface Album {
  nombre: string;
  fotoPortada: string;
  nombreArtisticoArtista: string;
  fechaPublicacion: string;
  duracion: number;
  reproducciones: number;
  favs: number;
  canciones: any[];
}

interface Cancion {
  id: number;
  nombre: string;
  duracion: number;
  reproducciones: number;
  fotoPortada: string;
  featuring: any[];
  fechaPublicacion: string;
}


@Component({
  selector: 'app-album',
  standalone: true, 
  imports: [CommonModule,DurationPipe,FormsModule],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']  
})
export class AlbumComponent implements OnInit, OnDestroy {

  currentIndex: number = 0;
  isShuffle: boolean = false;
  isPlaying: boolean = false;
  isBucle: boolean = false;
  currentTrack: any;

  mostrarBarra: boolean = false;
  showDropdownId: number | null = null;
  showListsDropdown: boolean = false;
  DropdownSeguidores: boolean = false;
  misPlaylists: any[] = [];
  albumId: string = '';
  private playSubscription!: Subscription;
  private shuffleSubscription!: Subscription;

  //buscador de mis playlists (para añadir canción a una playlist)
  filteredPlaylists: any[] = [];
  searchPlaylistTerm: string = '';

  // modal crear playlist
  isModalPlaylistOpen = false;
  cancionActual: any;
  NuevaPlaylist: any;

  nombre: string = '';
  fotoNueva!: string;
  file:  File | null = null;router: any;
  mensajeError: string = '';
;

  album: Album = { nombre: '', fotoPortada: '', nombreArtisticoArtista: '', fechaPublicacion: '', duracion: 0, reproducciones: 0, favs: 0, canciones: []};


  @ViewChild('barraSuperior', { static: false }) topBar!: ElementRef<HTMLElement>;

   @HostListener('document:click', ['$event'])
      clickOutside(event: Event) {
          // Cerrar el dropdown de la canción
          if (this.showDropdownId !== null) {
              const target = event.target as HTMLElement;
              const isDropdownOrChild = target.closest('.song-ellipsis');
              if (!isDropdownOrChild) {
                  this.showDropdownId = null;
                  this.showListsDropdown = false;
              }
          }          
      }
  

  constructor(private route: ActivatedRoute, private playerService: PlayerService, private el: ElementRef,private authService:AuthService, private favoritosService: FavoritosService, private tokenService: TokenService,private subirCloudinary: SubirCloudinary,private notificationService: NotificationService) {}

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id'); 
    if (albumId) {
      this.albumId = albumId;
      this.getAlbum(albumId);  
    }

    // Nos suscribimos al observable para recibir el play/pause
    this.playSubscription = this.playerService.isPlaying$
    .subscribe(playData => {
      if (playData) {
        if (this.tokenService.getColeccionActual() != null && this.albumId != '') {
          if (this.tokenService.getColeccionActual().id.toString() == this.albumId) {
            if (playData.emisor != 'pantalla') {
              console.log('dentro evento play pantalla', playData);
              this.isPlaying = playData.play;
            }
          }
        }
      }
    });

    // Nos suscribimos al observable para recibir el shuffle/no shuffle
    this.shuffleSubscription = this.playerService.isShuffle$
    .subscribe(shuffleData => {
      if (shuffleData) {
        if (this.tokenService.getColeccionActual() != null && this.albumId != '') {
          if (this.tokenService.getColeccionActual().id.toString() == this.albumId) {
            if (shuffleData.emisor != 'pantalla') {
              console.log('dentro evento shuffle pantalla', shuffleData);
              this.isShuffle = shuffleData.shuffle;
            }
          }
        }
      }
    });


 
    this.mostrarBarra =  false;
      
      const topDiv = this.el.nativeElement.querySelector('.top-div');
    
      if (topDiv) {
        const observer = new IntersectionObserver(
          (entries) => {
            this.mostrarBarra = !entries[0].isIntersecting;
          },
          { threshold: 0 }
        );
        observer.observe(topDiv);
      }
  }

  getAlbum(albumId: string): void {
    this.authService.datosAlbum(albumId).subscribe({
      next: (data) => {
        console.log('respuesta', data);
        this.album.nombre = data.nombre; 
        this.album.fotoPortada = data.fotoPortada
        this.album.nombreArtisticoArtista = data.nombreArtisticoArtista
        this.album.duracion = data.duracion
        this.album.reproducciones = data.reproducciones
        this.album.favs = data.favs
        this.album.fechaPublicacion = this.formatearFecha(data.fechaPublicacion)

        this.album.canciones = data.canciones.map((cancion: Cancion) => ({
          ...cancion,
          //featuring: cancion.featuring.length ? ` ${cancion.featuring.join(', ')}` : '',
          fechaPublicacion: this.formatearFecha(cancion.fechaPublicacion)
        }));
      },
      error: (error) => {
        console.error('Error al autenticar:', error);
        this.mensajeError = error.error.error
          // No esta logeado
          if (this.mensajeError === 'Token inválido.') {
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

  abrirModalPlaylist(cancion:any) {
    this.isModalPlaylistOpen = true;
    this.cancionActual=cancion;
    console.log('Modal abierto:', this.isModalPlaylistOpen);
  }

  cerrarModalPlaylist() {
    this.isModalPlaylistOpen = false;
    this.fotoNueva = '';
  }

  formatearFecha(fecha: string): string {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    const partes = fecha.split("-"); // Divide la fecha (ej. "2025-03-09")
    if (partes.length !== 3) return fecha; // Si el formato no es válido, devuelve la original
    
    const mes = meses[parseInt(partes[1], 10) - 1]; // Convierte "03" en índice 2 -> "Marzo"
    const año = partes[0]; // Año es la primera parte
    
    return `${mes} ${año}`;
  }
  

  
  toggleDropdown(cancionId: number): void {
    console.log(`Toggling dropdown for cancionId: ${cancionId}`);
    
    // Cambia el estado de showDropdownId
    if (this.showDropdownId === cancionId) {
      console.log('Closing dropdown because it was already open.');
      this.showDropdownId = null; // Cierra el dropdown
    } else {
      console.log('Opening dropdown for a new cancionId.');
      this.showDropdownId = cancionId; // Abre el dropdown
    }
    this.showListsDropdown = false;
    console.log('Lists dropdown reset to:', this.showListsDropdown);
  }
  

  toggleListsDropdown(event: Event): void {
    event.stopPropagation();  
    this.showListsDropdown = !this.showListsDropdown;
    if (!this.misPlaylists || this.misPlaylists.length === 0) {
      this.pedirMisPlaylist();
    }
    console.log('Toggling lists dropdown:', this.showListsDropdown);
  }

  toggleFav(id: any) {
    const cancionIndex = this.album.canciones.findIndex(c => c.id === id);
      
    if (cancionIndex !== -1) {
    
      this.authService.favoritos(id, !this.album.canciones[cancionIndex].fav)
      .subscribe({
        next: () => {
          this.album.canciones[cancionIndex].fav = !this.album.canciones[cancionIndex].fav;
          this.album.canciones = [...this.album.canciones];
  
          //ACTUALIZAR MARCO SI ES LA QUE ESTÁ SONANDO
          this.favoritosService.actualizarFavMarco(id);
  
        },
        error: (error) => {
          console.error("Error al guardar en favoritos:", error);
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
          console.log("Canción añadida o quitada de favoritos con éxito");
        }
      });
    } 
  }
  
  getTotalDuracion(): number {
    return this.album.canciones.reduce((total: any, cancion: { duracion: any; }) => total + cancion.duracion, 0) || 0;
  }
  
  getFormattedDuration(totalDuracion: number): string {
    const minutos = Math.floor(totalDuracion / 60);
    const segundos = totalDuracion % 60;
    return `${minutos} minutos ${segundos} segundos`;
  }

  pedirMisPlaylist(): void {
    this.authService.pedirMisPlaylists()
      .subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);
          
          if (response && response.misPlaylists && response.misPlaylists.playlists) {
            this.misPlaylists = response.misPlaylists.playlists;
          } else if (response && response.playlists) {
            this.misPlaylists = response.playlists;
          } else {
            console.error('La respuesta no contiene el formato esperado de playlists');
          }
          this.filteredPlaylists = this.misPlaylists;
          console.log('Mis playlists asignadas:', this.misPlaylists);
        },
        error: (error) => {
          console.error("Error al obtener las playlists:", error);
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
          console.log("Playlists recuperadas con éxito");
        }
      });
  }

  filterPlaylists() {
    if (!this.searchPlaylistTerm) {
      this.filteredPlaylists = this.misPlaylists;
    } else {
      this.filteredPlaylists = this.misPlaylists.filter(playlist => 
        playlist.nombre.toLowerCase().includes(this.searchPlaylistTerm.toLowerCase())
      );
    }
  }

  anadiraPlaylist(playlistId: string,cancionId:string): void {
    this.authService.addToPlaylist(cancionId,playlistId)
    .subscribe({
      next: (response) => {   
        console.log('Cancion añadida', response);
        this.notificationService.showSuccess(`Cancion añadidida a la playlist`);
      },
      error: (error) => {
        console.error("Error al obtener añadir la cancion a la playlist:", error);
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
        console.log("Cancion añadida con éxito");
      }
    });
  }

  //Lógica de reproducción

  onTrackClick(track: any) {
    const idsCanciones = this.album.canciones.map((c: {id: any}) => c.id);
    this.playerService.setTrackInCollection(this.albumId, track.id, idsCanciones)
  }

  playAlbum() {

    //Comprueba si el álbum ya estaba puesto o no, si es que no, empieza su reproducción. Si es que si, reaunuda o para la canción.
    this.playerService.setColeccion(this.albumId, this.album.canciones, this.isShuffle);

    if (!this.isPlaying) {
      this.isPlaying = true;
    }else {
      this.isPlaying = false;
    }

    this.playerService.togglePlay('pantalla')
   
  }

  toggleShuffle(): void {

    if (!this.isShuffle) {
      this.isShuffle = true;
    }else {
      this.isShuffle = false;
    }

    //Comprueba si el álbum ya estaba puesto o no, si es que no, empieza su reproducción. Si es que si, cambia el shuffle la canción.
    this.playerService.setColeccion(this.albumId, this.album.canciones, this.isShuffle);
    this.playerService.toggleShuffle('pantalla', this.isShuffle)
    
  }

  ngOnDestroy(): void {
    if (this.playSubscription) {
      this.playSubscription.unsubscribe();
    }

    if (this.shuffleSubscription) {
      this.shuffleSubscription.unsubscribe();
    }
  }

  
  preventDropdownClose(event: Event) {
    event.stopPropagation();
  }

  crearPlaylist(cancionId:any): void {
        if (this.file) {
          this.subirCloudinary.uploadFile(this.file, 'playlist').pipe(
            switchMap((url) => {
              console.log('Imagen subida:', url);
              this.fotoNueva = url;
              return this.authService.crearPlaylist(this.fotoNueva,this.nombre);
            })
          ).subscribe({
            next: (response) => {
              this.NuevaPlaylist=response.id;
              this.anadiraPlaylist(this.NuevaPlaylist,cancionId);
              this.fotoNueva='';
              this.file = null;
              this.cerrarModalPlaylist();
              console.log("Playlist creada con éxito");
              this.pedirMisPlaylist(); 
            },
            error: (error) => {
              console.error("Error al crear la playlist", error);
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
              console.log("Playlist creada con éxito");
            }
          });
        } else {
          const foto = this.fotoNueva ? this.fotoNueva : "DEFAULT";
          this.authService.crearPlaylist(foto, this.nombre).subscribe({
            next: (response) => {
              this.NuevaPlaylist=response.id;
              this.anadiraPlaylist(this.NuevaPlaylist,cancionId);
              this.cerrarModalPlaylist();
              console.log("Playlist creada con éxito");
              this.pedirMisPlaylist(); 
            },
            error: (error) => {
              console.error("Error al crear la playlist:", error);
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
              console.log("Playlist creada con éxito");
            }
          });
        }
      }

  onFileSelectedPlaylist(event:any) {
    this.file = event.target.files[0];
    if (this.file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.fotoNueva = e.target.result; // Asigna la URL base64 de la imagen a la variable fotoPortada
        };
        reader.readAsDataURL(this.file);
    }
  }

  convertirFecha(fechaStr: string): Date {
    const [dia, mes, año] = fechaStr.split(" ").map(Number); 
    return new Date(año, mes - 1, dia); 
  } 

}
