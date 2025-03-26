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
    misSeguidores: any[] = [];
    esMiPlaylist: boolean = false;
    soyColaborador: boolean = false; 
    usuarioActual: string = ''; 
    
    @ViewChild('barraSuperior', { static: false }) topBar!: ElementRef<HTMLElement>;

    constructor(private el: ElementRef, private authService: AuthService, private tokenService: TokenService, private router: Router, private playerService: PlayerService, private route: ActivatedRoute){}

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
      this.getMiNombre();
      this.pedirMisPlaylist(); 
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
    if (!this.misSeguidores || this.misSeguidores.length === 0) {
      this.pedirMisSeguidores();
    }
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
      next: () => {},
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
  

  getPlaylist(playlistId: string): void {
    this.authService.pedirDatosPlaylist(playlistId)
    .subscribe({
      next: (response) => {   
        this.playlist = response;
        console.log('Playlist:', this.playlist);
        this.esMiPlaylist = this.playlist?.playlist?.creador === this.usuarioActual;
        this.soyColaborador = this.playlist?.playlist?.colaboradores?.includes(this.usuarioActual);
        console.log('Es mi playlist?:', this.esMiPlaylist);
        console.log('Soy colaborador?:', this.soyColaborador);
        console.log('usuario', this.usuarioActual);
        console.log('creador',  this.playlist?.playlist?.creador);
      },
      error: (error) => {
        console.error("Error al obtener los datos de la playlist:", error);
      },
      complete: () => {
        console.log("Playlist recuperada con éxito");
      }
    });
  }

  getMiNombre(): void {
    this.authService.pedirMiNombre()
    .subscribe({
      next: (response) => {   
        this.usuarioActual = response.nombreUsuario;
        console.log('Nombre de usuario:', this.usuarioActual);
      },
      error: (error) => {
        console.error("Error al obtener el nombre del usuario", error);
      },
      complete: () => {
        console.log("Nombre recuperado con éxito");
      }
    });
  }

  anadiraPlaylist(playlistId: string,cancionId:string): void {
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

}
