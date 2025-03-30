import { Component, OnInit, EventEmitter, Output, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { ActivatedRoute } from '@angular/router';
import { DurationPipe } from '../../pipes/duration.pipe';
import { Location } from '@angular/common';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-playlist',
  imports: [CommonModule, RouterModule, FormsModule,DurationPipe],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent {
    playlist: any = null;
    isPlaying: boolean = false;
    mostrarBarra: boolean = false;
    isShuffle: boolean = false;
    currentTrack: any;
    nombre: string ='';
    misPlaylists: any[] = [];
    currentPlaylistId: number | null = null;
    showDropdownId: number | null = null;
    showListsDropdown: boolean = false;
    DropdownSeguidores: boolean = false;
    DropdownMenu: boolean = false;
    misSeguidores: any[] = [];
    esMiPlaylist: boolean = false;
    soyColaborador: boolean = false; 
    usuarioActual: string = ''; 

    isModalEditarOpen= false;
    mensajeError = '';

    nombreActual: string = '';
    fotoNueva!: string;
    file!: File;

    //buscador de mis playlists (para añadir canción a una playlist)
    filteredPlaylists: any[] = [];
    searchPlaylistTerm: string = '';

    //buscador para invitados
    searchInvitadosTerm: string = '';
    searchedInvitados: any[] = [];

    //buscador para playlist vacia
    searchSongTerm: string = '';
    searchResults: any[] = [];

    // modal crear playlist
    isModalPlaylistOpen = false;
    cancionActual: any;
    NuevaPlaylist: any;

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

        // Cerrar el dropdown de seguidores
        if (this.DropdownSeguidores) {
            const target = event.target as HTMLElement;
            const isDropdownOrChild = target.closest('.fa-user');
            if (!isDropdownOrChild) {
                this.DropdownSeguidores = false;
            }
        }

        // Cerrar el dropdown de menú
        if (this.DropdownMenu) {
            const target = event.target as HTMLElement;
            const isDropdownOrChild = target.closest('.fa-ellipsis-h');
            if (!isDropdownOrChild) {
                this.DropdownMenu = false;
            }
        }
    }


    constructor(private el: ElementRef, private authService: AuthService, private tokenService: TokenService, private router: Router, private playerService: PlayerService, private route: ActivatedRoute,private location: Location,  private subirCloudinary: SubirCloudinary){}

    ngOnInit(): void {
      const playlistId = this.route.snapshot.paramMap.get('id'); 
      if (playlistId) {
        this.currentPlaylistId = +playlistId;
        this.getPlaylist(playlistId);  
      }
      
      this.mostrarBarra =  false;
      
      const topDiv = this.el.nativeElement.querySelector('.top-div');
    
      if (topDiv) {
        const observer = new IntersectionObserver(
          (entries) => {
            this.mostrarBarra = !entries[0].isIntersecting;
            console.log('mostrar:', this.mostrarBarra);
          },
          { threshold: 0 }
        );
        observer.observe(topDiv);
      }

      this.playerService.isPlaying$.subscribe(isPlaying => {
        this.isPlaying = isPlaying; 
      });
    
      this.playerService.currentTrack$.subscribe(track => {
        this.isPlaying = !!track; // Si hay una canción, isPlaying será true
        this.currentTrack = track;
      });
      this.pedirMisPlaylist(); 
  }

  abrirModalEditar() {
    this.isModalEditarOpen = true;
  }

  cerrarModalEditar() {
    this.isModalEditarOpen = false;
    this.fotoNueva = '';
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

  toggleDropdownSeguidores(): void {
    this.DropdownSeguidores = !this.DropdownSeguidores;
  }

  toggleDropdownMenu(): void {
    this.DropdownMenu = !this.DropdownMenu;
  }

  

  toggleShuffle(): void {
    this.playerService.toggleShuffle(); // Habilitar o deshabilitar el shuffle
    this.isShuffle = this.playerService.isShuffleEnabled();
  }

  toggleFavorite(id: any) {
    const cancionIndex = this.playlist.canciones.findIndex((c: { id: any; }) => c.id === id);
    
  if (cancionIndex !== -1) {
    this.playlist.canciones[cancionIndex].fav = !this.playlist.canciones[cancionIndex].fav;
    this.playlist.canciones = [...this.playlist.canciones];

    this.authService.favoritos(id, this.playlist.canciones[cancionIndex].fav)
    .subscribe({
      next: () => {
        if (this.playlist.playlist.nombrePlaylist === 'Favoritos') {
          console.log('Canción eliminada de favoritos:', id);
          this.playlist.canciones = this.playlist.canciones.filter((c: { id: string; }) => c.id !== id);
        }
      },
      error: (error) => {
        console.error("Error al guardar en favoritos:", error);
      },
      complete: () => {
        console.log("Canción añadida a favoritos con éxito");
      }
    });
  }
  }
  

  getTotalDuracion(): number {
    return this.playlist?.canciones?.reduce((total: any, cancion: { duracion: any; }) => total + cancion.duracion, 0) || 0;
  }
  
  getFormattedDuration(totalDuracion: number): string {
    const minutos = Math.floor(totalDuracion / 60);
    const segundos = totalDuracion % 60;
    return `${minutos} minutos ${segundos} segundos`;
  }

  onTrackClick(track: any) {
    // Llamamos al servicio para establecer la canción seleccionada y el álbum con la lista de canciones
    this.playerService.setTrack(track, this.playlist?.canciones); // Pasamos la lista de canciones del álbum
  }
  

  getPlaylist(playlistId: any): void {
    this.authService.pedirDatosPlaylist(playlistId)
    .subscribe({
      next: (response) => {   
        this.playlist = response;
        this.fotoNueva = this.playlist.playlist.fotoPortada;
        this.nombreActual = this.playlist.playlist.nombrePlaylist;
        console.log('Playlist:', this.playlist);

        this.esMiPlaylist = this.playlist?.rol==="creador";
        this.soyColaborador = this.playlist?.rol==="participante";

      },
      error: (error) => {
        console.error("Error al obtener los datos de la playlist:", error);
      },
      complete: () => {
        console.log("Playlist recuperada con éxito");
      }
    });
  }


  anadiraPlaylist(playlistId: any,cancionId:string): void {
    this.authService.addToPlaylist(cancionId,playlistId)
    .subscribe({
      next: (response) => {   
        console.log('Cancion añadida', response);
      },
      error: (error) => {
        console.error("Error al obtener añadir la cancion a la playlist:", error);
      },
      complete: () => {
        console.log("Cancion añadida con éxito");
      }
    });
  }

  eliminarDePlaylist(playlistId: string,cancionId:string): void {
    this.authService.deleteFromPlaylist(cancionId,playlistId)
    .subscribe({
      next: (response) => { 
        this.playlist.canciones = this.playlist.canciones.filter((c: { id: string; }) => c.id !== cancionId);
        console.log('Cancion eliminada', response);
      },
      error: (error) => {
        console.error("Error al obtener eliminar la cancion de la playlist:", error);
      },
      complete: () => {
        console.log("Cancion eliminada con éxito");
      }
    });
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
        },
        complete: () => {
          console.log("Playlists recuperadas con éxito");
        }
      });
  }

  pedirMisSeguidores(): void {
    this.authService.pedirMisSeguidores()
      .subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);
          
          if (response && response.seguidores) {
            this.misSeguidores = response.seguidores;
          } else {
            console.error('La respuesta no contiene el formato esperado de playlists');
          }
          
          console.log('Mis seguidores:', this.misSeguidores);
        },
        error: (error) => {
          console.error("Error al obtener los seguidores:", error);
        },
        complete: () => {
          console.log("Seguidores recuperados con éxito");
        }
      });
  }

  invitarUsuario(seguidor: { nombreUsuario: string },playlist: any): void {
    this.authService.invitarUsuario(seguidor.nombreUsuario,playlist)
      .subscribe({
        next: (response) => {
          console.log('Solicitud enviada');
        },
        error: (error) => {
          console.error("Error al enviar la solicitud");
        },
        complete: () => {
          console.log("Solicitud enviada con éxito");
        }
      });
  }


  eliminarPlaylist(playlist: any): void {
    this.authService.deletePlaylist(playlist)
      .subscribe({
        next: (response) => {
          this.location.back();
        },
        error: (error) => {
          console.error("Error al eliminar la playlist");
        },
        complete: () => {
          console.log("Playlist eliminada con éxito");
        }
      });
  }

  cambiarPrivacidad(playlist: any,privacidad:boolean): void {
    privacidad=!privacidad;
    this.authService.cambiarPrivacidadPlaylist(playlist,privacidad)
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.error("Error al cambiar la privacidad de la playlist");
        },
        complete: () => {
          console.log("Privacidad cambiada con éxito");
        }
      });
  }

  abandonarPlaylist(playlistId: any): void {
    this.authService.abandonarPlaylist(playlistId)
    .subscribe({
      next: (response) => { 
        this.location.back();
      },
      error: (error) => {
        console.error("Error al abandonar la playlist:", error);
      },
      complete: () => {
        console.log("Playlist abandonada con éxito");
      }
    });
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

  guardarCambiosPlaylist() {
      if (this.file) {
        this.subirCloudinary.uploadFile(this.file, 'playlist').pipe(
          switchMap((url) => {
            console.log('Imagen subida:', url);
            this.fotoNueva = url;
            return this.authService.cambiarDatosPlaylist(this.currentPlaylistId,this.nombreActual, this.fotoNueva);
          })
        ).subscribe({
          next: () => {
            this.playlist.playlist.nombrePlaylist = this.nombreActual;
            this.playlist.playlist.fotoPortada= this.fotoNueva;
            this.cerrarModalEditar();
          },
          error: (error) => {
            console.error("Error al guardar los nuevos datos:", error);
            this.nombreActual = this.playlist.playlist.nombrePlaylist
          },
          complete: () => {
            console.log("Datos guardados con éxito");
          }
        });
      } else {
        const foto = this.fotoNueva ? this.fotoNueva : "DEFAULT";
        this.authService.cambiarDatosPlaylist(this.currentPlaylistId,this.nombreActual, foto).subscribe({
          next: () => {
            this.playlist.playlist.nombrePlaylist = this.nombreActual;
            this.cerrarModalEditar();
          },
          error: (error) => {
            console.error("Error al guardar los nuevos datos:", error);
            this.nombreActual = this.playlist.playlist.nombrePlaylist;
          },
          complete: () => {
            console.log("Datos guardados con éxito");
          }
        });
      }
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

    preventDropdownClose(event: Event) {
      event.stopPropagation();
    }

    buscarInvitados() {
      if (!this.searchInvitadosTerm.trim()) {
        this.searchedInvitados = [];
        return;
      }

      this.authService.buscarInvitados(this.searchInvitadosTerm, this.currentPlaylistId)
        .subscribe({
          next: (response) => {
            this.searchedInvitados = response.perfiles || [];
            console.log('Resultados de búsqueda:', response);
          },
          error: (error) => {
            console.error("Error al buscar invitados:", error);
            this.searchedInvitados = [];
          }
        });
    }

    searchSongsForPlaylist() {
      if (!this.searchSongTerm || this.searchSongTerm.trim().length === 0) {
        this.searchResults = [];
        return;
      }
    
      if (!this.currentPlaylistId) {
        console.error('No playlist ID available');
        return;
      }
    
      this.authService.buscadorPlaylist(this.searchSongTerm,this.currentPlaylistId)
        .subscribe({
          next: (response) => {
            this.searchResults = response.canciones || [];
            console.log('Resultados de búsqueda:', response);
          },
          error: (error) => {
            console.error("Error al buscar canciones:", error);
            this.searchResults = [];
          }
        });
      
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
            this.cerrarModalPlaylist();
            console.log("Playlist creada con éxito");
            this.pedirMisPlaylist(); 
          },
          error: (error) => {
            console.error("Error al crear la playlist", error);
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
          },
          complete: () => {
            console.log("Playlist creada con éxito");
          }
        });
      }
    }

}
