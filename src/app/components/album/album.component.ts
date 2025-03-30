<<<<<<< Updated upstream
import { Component, OnInit } from '@angular/core';
=======
import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
>>>>>>> Stashed changes
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { SidebarService } from '../../services/sidebar.service';
<<<<<<< Updated upstream
=======
import { AuthService } from '../../services/auth.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { FavoritosService } from '../../services/favoritos.service';


interface Cancion {
  id: number;
  nombre: string;
  duracion: number;
  reproducciones: number;
  fotoPortada: string;
  featuring: any[];
  fechaPublicacion: string;
}

>>>>>>> Stashed changes

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
<<<<<<< Updated upstream
export class AlbumComponent /*implements OnInit*/ {
  album: any = null;
  artistNames: string = '';
  sidebarOpen = false;
=======
export class AlbumComponent implements OnInit {
  album: any = null;
  canciones: any[] = [];

  currentIndex: number = 0;
  isShuffle: boolean = false;
  isPlaying: boolean = false;
  currentTrack: any;
>>>>>>> Stashed changes

  mostrarBarra: boolean = false;
  showDropdownId: number | null = null;
  showListsDropdown: boolean = false;
  DropdownSeguidores: boolean = false;
  misPlaylists: any[] = [];

<<<<<<< Updated upstream
  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private sidebarService: SidebarService
  ) {}
=======

  @ViewChild('barraSuperior', { static: false }) topBar!: ElementRef<HTMLElement>;

  constructor(private route: ActivatedRoute, private playerService: PlayerService, private el: ElementRef,private authService:AuthService, private favoritosService: FavoritosService) {}
>>>>>>> Stashed changes

  ngOnInit() {
    this.album = this.route.snapshot.paramMap.get('id');
    if (this.album) {
      //this.getAlbum(albumId);
    }
<<<<<<< Updated upstream
    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });
  }

  canciones = [
    { nombre: "Canción 1", duracion: "3:15", foto:"" },
    { nombre: "Canción 2", duracion: "4:05",foto:"" },
    { nombre: "Canción 3", duracion: "2:45", foto:"" },
    { nombre: "Canción 5", duracion: "2:45", foto:"" },
    { nombre: "Canción 6", duracion: "2:45", foto:""}
];


  /*getAlbum(albumId: string) {
    this.authService.getAlbum(albumId).subscribe((data: any) => {
      this.album = data;
      this.artistNames = this.album.artists.map((a: any) => a.name).join(', ');
    });
  }

  playTrack(track: any) {
    this.playerService.setTrack(track);
  }*/
=======

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
  }

  getAlbum(albumId: string): void {
    this.authService.datosAlbum(albumId).subscribe({
      next: (data) => {
        this.album = data.album; 
        this.album.fechaPublicacion = this.formatearFecha(data.album.fechaPublicacion)
        this.canciones = data.album.canciones.map((cancion: Cancion) => ({
          ...cancion,
          featuring: cancion.featuring.length ? ` ${cancion.featuring.join(', ')}` : '',
          fechaPublicacion: this.formatearFecha(cancion.fechaPublicacion)
        }));
        console.log('recibo:', this.album);
      },
      error: (error) => {
        console.error('Error al autenticar:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
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
    const cancionIndex = this.canciones.findIndex(c => c.id === id);
      
    if (cancionIndex !== -1) {
    
      this.authService.favoritos(id, !this.canciones[cancionIndex].fav)
      .subscribe({
        next: () => {
          this.canciones[cancionIndex].fav = !this.canciones[cancionIndex].fav;
          this.canciones = [...this.canciones];
  
          //ACTUALIZAR MARCO SI ES LA QUE ESTÁ SONANDO
          this.favoritosService.actualizarFavMarco(id);
  
        },
        error: (error) => {
          console.error("Error al guardar en favoritos:", error);
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

  //Lógica de reproducción

  toggleShuffle(): void {
    this.playerService.toggleShuffle(); // Habilitar o deshabilitar el shuffle
    this.isShuffle = this.playerService.isShuffleEnabled();
  }

  onTrackClick(track: any) {
    // Llamamos al servicio para establecer la canción seleccionada y el álbum con la lista de canciones
    this.playerService.setTrack(track, this.album.canciones); // Pasamos la lista de canciones del álbum
  }

  playAlbum() {
    if (!this.isPlaying) {
      this.isPlaying = true;
    }else {
      this.isPlaying = false;
    }

    //Comprueba si el álbum ya estaba puesto o no, si es que no, empieza su reproducción
    this.playerService.setColeccion(this.album);
   
    //Toggle play para parar o reaunudar el audio


   
  }

  
>>>>>>> Stashed changes
}
