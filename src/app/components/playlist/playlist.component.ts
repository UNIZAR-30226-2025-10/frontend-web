import { Component, OnInit, EventEmitter, Output, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { ActivatedRoute } from '@angular/router';
import { DurationPipe } from '../../pipes/duration.pipe';
import { Location } from '@angular/common';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';


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

    private playSubscription!: Subscription;
    private shuffleSubscription!: Subscription;

    isModalEditarOpen= false;
    mensajeError = '';

    nombreActual: string = '';
    fotoNueva!: string;
    file:  File | null = null;;

    isHovered = false;

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

    // modal colaboradores
    isModalColaboradoresOpen = false;

    // menu de ordenación
    showSortMenu: boolean = false;

    //orden de las canciones
    originalSongOrder: any[] = [];
    currentSortMethod: string = 'fecha';

    // Opciones de ordenación
    sortOptions = [
      { value: 'nombre', label: 'Alfabético' },
      { value: 'reproducciones', label: 'Reproducciones' },
      { value: 'fecha', label: 'Fecha' }
    ];

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

        // Cerrar el dropdown de ordenar (sort-dropdown)
        if (this.showSortMenu) {
          const target = event.target as HTMLElement;
          const isDropdownOrChild = target.closest('.sort-dropdown') || target.closest('.sort-icon');
          if (!isDropdownOrChild) {
              this.showSortMenu = false;
          }
        }
    }


    constructor(private el: ElementRef, private authService: AuthService, private tokenService: TokenService, private router: Router, private playerService: PlayerService, private route: ActivatedRoute,private location: Location,  private subirCloudinary: SubirCloudinary, private notificationService: NotificationService){}

    ngOnInit(): void {
      const playlistId = this.route.snapshot.paramMap.get('id'); 
      if (playlistId) {
        this.currentPlaylistId = +playlistId;
        this.getPlaylist(playlistId);  
      }

      // Nos suscribimos al observable para recibir el play/pause
    this.playSubscription = this.playerService.isPlaying$
    .subscribe(playData => {
      if (playData) {
        if (this.tokenService.getColeccionActual() != null && String(this.currentPlaylistId) != '') {
          if (this.tokenService.getColeccionActual().id.toString() == String(this.currentPlaylistId)) {
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
        if (this.tokenService.getColeccionActual() != null && String(this.currentPlaylistId) != '') {
          if (this.tokenService.getColeccionActual().id.toString() == String(this.currentPlaylistId)) {
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
            console.log('mostrar:', this.mostrarBarra);
          },
          { threshold: 0 }
        );
        observer.observe(topDiv);
      }

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

  abrirModalColaboradores() {
    this.isModalColaboradoresOpen = true
    console.log("abierot colab")
  }

  cerrarModalColaboradores() {
    this.isModalColaboradoresOpen = false;
  }

  toggleSortMenu(): void {
    this.showSortMenu = !this.showSortMenu;
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

  //Lógica de reproducción
  onTrackClick(track: any) {
    const idsCanciones = this.playlist.canciones.map((c: {id: any}) => c.id);
    this.playerService.setTrackInCollection(String(this.currentPlaylistId), track.id, idsCanciones)
  }

  playLista() {
    //Comprueba si  la playlist ya estaba puesto o no, si es que no, empieza su reproducción. Si es que si, reaunuda o para la canción.
    this.playerService.setColeccion(String(this.currentPlaylistId), this.playlist.canciones, this.isShuffle);

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
    this.playerService.setColeccion(String(this.currentPlaylistId), this.playlist.canciones, this.isShuffle);
    this.playerService.toggleShuffle('pantalla', this.isShuffle)
    
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

  convertirFecha(fechaStr: string): Date {
    const [dia, mes, año] = fechaStr.split(" ").map(Number); 
    return new Date(año, mes - 1, dia); 
  } 

  // Método para ordenar las canciones
  sortSongs(sortBy: string): void {
    if (!this.playlist || !this.playlist.canciones) return;
    
    // Guardar el método de ordenación actual
    this.currentSortMethod = sortBy;
    
    // Si es la primera vez que ordenamos, guardamos el orden original
    if (!this.originalSongOrder.length) {
      this.originalSongOrder = [...this.playlist.canciones];
    }
    
    const sortedSongs = [...this.playlist.canciones]; 
    
    switch (sortBy) {
      case 'nombre':
        sortedSongs.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'reproducciones':
        sortedSongs.sort((a, b) => b.reproducciones - a.reproducciones);
        break;
      case 'fecha':
        if (this.originalSongOrder.length) {
          this.playlist.canciones = [...this.originalSongOrder];
          return;
        }
        break;
    } 
    this.playlist.canciones = sortedSongs;
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
        console.log("Playlist recuperada con éxito");
      }
    });
  }


  anadiraPlaylist(playlistId: any,cancionId:string): void {
    this.authService.addToPlaylist(cancionId,playlistId)
    .subscribe({
      next: (response) => {   
        console.log('Cancion añadida', response);
        this.notificationService.showSuccess(`Cancion añadidida a la playlist`);
      },
      error: (error) => {
        if (error.status === 409) {
          this.notificationService.showError('La canción ya está en esa playlist.');
        } else {
          console.error("Error al añadir la canción a la playlist:", error);
        }
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

  eliminarDePlaylist(playlistId: string,cancionId:string): void {
    this.authService.deleteFromPlaylist(cancionId,playlistId)
    .subscribe({
      next: (response) => { 
        this.playlist.canciones = this.playlist.canciones.filter((c: { id: string; }) => c.id !== cancionId);
        console.log('Cancion eliminada', response);
        this.notificationService.showSuccess(`Cancion eliminada de la playlist`);
      },
      error: (error) => {
        console.error("Error al obtener eliminar la cancion de la playlist:", error);
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
          console.log("Seguidores recuperados con éxito");
        }
      });
  }

  invitarUsuario(seguidor: { nombreUsuario: string },playlist: any): void {
    this.authService.invitarUsuario(seguidor.nombreUsuario,playlist)
      .subscribe({
        next: (response) => {
          console.log('Solicitud enviada');
          this.notificationService.showSuccess(`Solicitud enviada a ${seguidor.nombreUsuario}`);
        },
        error: (error) => {
          console.error("Error al enviar la solicitud");
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
          console.log("Solicitud enviada con éxito");
        }
      });
  }

  echarUsuario(nombreUsuario:string,playlist: any): void {
    this.authService.echarUsuario(nombreUsuario,playlist)
      .subscribe({
        next: (response) => {
          this.notificationService.showSuccess(`Usuario ${nombreUsuario} expulsado de la playlist`);
          this.playlist.playlist.colaboradores = this.playlist.playlist.colaboradores.filter((c: string) => c !== nombreUsuario);
          if (!playlist?.playlist?.colaboradores?.length) {
            this.cerrarModalColaboradores();
          }
          
          
        },
        error: (error) => {
          console.error("Error al expulsar al usuario de la playlist");
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
          console.log("Usuario expulsado con éxito");
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
          console.log("Playlist eliminada con éxito");
        }
      });
  }

  cambiarPrivacidad(playlist: any,privacidad:boolean): void {
    privacidad=!privacidad;
    this.authService.cambiarPrivacidadPlaylist(playlist,privacidad)
      .subscribe({
        next: (response) => {
          this.playlist.playlist.privacidad=privacidad;
        },
        error: (error) => {
          console.error("Error al cambiar la privacidad de la playlist");
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
            this.fotoNueva='';
            this.file = null;
            this.cerrarModalEditar();
          },
          error: (error) => {
            console.error("Error al guardar los nuevos datos:", error);
            this.nombreActual = this.playlist.playlist.nombrePlaylist
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

}
