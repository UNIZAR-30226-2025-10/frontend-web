import { Component, AfterViewInit, ElementRef, ViewChild, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';


interface datosArtista {
  nombreUsuario: string;
  nombreArtistico: string;
  foto: string;
  biografia: string;
  nSeguidores: number;
  nSeguidos: number;
  siguiendo: boolean;
}

interface Noizzy {
  texto: string | null;
  id: number;
  fecha: string;
  like: boolean;
}

interface Cancion {
  id: number;
  nombre: string;
  duracion: number;
  reproducciones: number;
  fotoPortada: string;
}


@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./artista.component.css']
})
export class ArtistaComponent implements OnInit, AfterViewInit {
  @ViewChild('profilePic', { static: false }) profilePic!: ElementRef<HTMLImageElement>;
  @ViewChild('header', { static: false }) header!: ElementRef<HTMLElement>;
  @ViewChild('topBar', { static: false }) topBar!: ElementRef<HTMLElement>;
  @ViewChild('parteAbajo', { static: false }) parteAbajo!: ElementRef<HTMLElement>;


  foto: string = '';
  private headerHeight = 240;
  private dominantColor: string = 'rgb(100, 100, 100)';
  filtroActivo: string = 'canciones';

  currentUser: string =  '';
  artista: datosArtista = { nombreUsuario: '', nombreArtistico:'', foto: '', biografia:'', nSeguidores: 0, nSeguidos: 0, siguiendo: false};
  ultimoNoizzy: Noizzy = { texto: '', id: 0, fecha: '', like: false};
  albumes: any[] = [];
  canciones: any[] = [];
  cancionesPopulares: any[] = [];
  numeroFavs: number = 0;
  hoverIndex: number | null = null;

  constructor(private tokenService: TokenService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.foto = this.tokenService.getUser().fotoPerfil;

    const nombreUsuario = this.route.snapshot.paramMap.get('nombreUsuario'); 
    if (nombreUsuario) {
      this.currentUser = nombreUsuario;
    }

    this.authService.pedirDatosOtroArtista(this.currentUser)
    .subscribe({
      next: (response) => {   
        this.artista.nombreUsuario = response.artista.nombreUsuario;
        this.artista.nombreArtistico = response.artista.nombreArtistico;
        this.artista.foto = response.artista.fotoPerfil;
        this.artista.biografia = response.artista.biografia;
        this.artista.nSeguidores = response.artista.numSeguidores;
        this.artista.nSeguidos = response.artista.numSeguidos;
        this.artista.siguiendo = response.artista.siguiendo;
        if(response.ultimoNoizzy != null) {
          this.ultimoNoizzy.id = response.ultimoNoizzy.id;
          this.ultimoNoizzy.fecha = response.ultimoNoizzy.fecha;
          this.ultimoNoizzy.like = response.ultimoNoizzy.like;
          this.ultimoNoizzy.texto = response.ultimoNoizzy.texto;
        }
      },
      error: (error) => {
        console.error("Error al guardar los nuevos datos:", error);
      },
      complete: () => {
        console.log("Datos guardados con éxito");
      }
    });

    forkJoin({
      albumes: this.authService.pedirAlbumesOtroArtista(this.currentUser),
      canciones: this.authService.pedirCancionesOtroArtista(this.currentUser),
      cancionesPopulares: this.authService.pedirCancionesPopularesOtroArtista(this.currentUser),
      numeroFavs: this.authService.pedirNumeroCancionesFavsArtista(this.currentUser)

    }).subscribe({
      next: (data) => {
        this.albumes = data.albumes.albumes;
        this.canciones = data.canciones.canciones;
        this.cancionesPopulares = data.cancionesPopulares.canciones_populares.map((cancion: Cancion) => ({
          ...cancion,
          duracion: this.convertirTiempo(cancion.duracion)
        }));
        this.numeroFavs = data.numeroFavs.total_favoritas;        
      },
      error: (error) => {
        console.error('Error en alguna de las peticiones principales:', error);
      }
    });

    
  }

  ngAfterViewInit(): void {
    
    if (this.profilePic?.nativeElement) {
      const img = this.profilePic.nativeElement;
      if (img.complete) {
        this.applyColor();
      } else {
        img.onload = () => {
          this.applyColor();
        };
      }
    } else {
      console.error('Error: profilePic no está referenciado.');
    }
  }

  onScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop; 
    if (!this.header?.nativeElement || !this.topBar?.nativeElement) return;

    // Calcula la opacidad con un rango de 0.5 a 1, alcanzando 1 antes de que se pase el header
    const opacity = Math.min(1, Math.max(0.4, (scrollTop / (this.headerHeight * 0.4))));

    // Extraer los valores de RGB del color dominante
    const rgbValues = this.dominantColor.match(/\d+/g);  // Obtiene los valores de r, g, b como un array
    if (rgbValues) {
      const [r, g, b] = rgbValues.map(Number);  // Convierte los valores en números

      // Aplicar el fondo en formato rgba con la opacidad
      this.header.nativeElement.style.background = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      this.topBar.nativeElement.style.background = `rgba(${r}, ${g}, ${b}, 1)`;
    }

    // Lógica para mostrar u ocultar el topBar
    if (scrollTop > this.headerHeight) {
      this.topBar.nativeElement.style.display = 'flex';
    } else {
      this.topBar.nativeElement.style.display = 'none';
    }
  }



  private applyColor(): void {
    this.getDominantColor(this.profilePic.nativeElement).then(color => {
      if (this.header?.nativeElement) {
        this.dominantColor = `rgb(${color.r}, ${color.g}, ${color.b}, 0.4)`;
        this.header.nativeElement.style.background = this.dominantColor;
      }
    });
  }

  // Función para convertir RGB a HSL
  private rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        s = 0; // Gris, sin saturación
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private async getDominantColor(imgEl: HTMLImageElement): Promise<{ r: number, g: number, b: number }> {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            resolve({ r: 0, g: 0, b: 0 }); // Color por defecto en caso de error
            return;
        }

        canvas.width = imgEl.naturalWidth || imgEl.width;
        canvas.height = imgEl.naturalHeight || imgEl.height;
        ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let bestColor = { r: 0, g: 0, b: 0, saturation: 0 };

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];

            // Convertir RGB a HSL para analizar saturación
            const { s } = this.rgbToHsl(r, g, b);

            // Filtrar colores muy oscuros o muy claros (opcional)
            const brightness = (r + g + b) / 3;
            if (brightness > 30 && brightness < 225) {
                if (s > bestColor.saturation) {
                    bestColor = { r, g, b, saturation: s };
                }
            }
        }

        resolve({ r: bestColor.r, g: bestColor.g, b: bestColor.b });
        console.log('color:', bestColor)
    });
}

cambiarFiltro(filtro: string) {
  this.filtroActivo = filtro;
}

toggleSeguir() {
  this.artista.siguiendo = !this.artista.siguiendo;
  //MANDAR AL BACKEND
}

toggleFav(id: any) {
  const cancionIndex = this.cancionesPopulares.findIndex(c => c.id === id);
    
  if (cancionIndex !== -1) {
    this.cancionesPopulares[cancionIndex].fav = !this.cancionesPopulares[cancionIndex].fav;
    this.cancionesPopulares = [...this.cancionesPopulares];

    this.numeroFavs += this.cancionesPopulares[cancionIndex].fav ? 1 : -1;

    this.authService.favoritos(id, this.cancionesPopulares[cancionIndex].fav)
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


  convertirTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    
    return `${minutos}:${segundosRestantes.toString().padStart(2, "0")}`;
  }

  playSong(id: any) {}

}


