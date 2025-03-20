import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  imports: [CommonModule, FormsModule],
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

  constructor(private tokenService: TokenService) {}
  
  canciones = [
    {
      ranking: 1,
      imagen: "logo_noizz.png",
      nombre: "GRAN VÍA",
      reproducciones: "69,698,951",
      duracion: "3:13",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 2,
      imagen: "logo_noizz.png",
      nombre: "Mon Amour - Remix",
      reproducciones: "50,000,000",
      duracion: "3:25",
      esFavorita: true,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 3,
      imagen: "logo_noizz.png",
      nombre: "Presiento",
      reproducciones: "45,000,000",
      duracion: "3:00",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 4,
      imagen: "logo_noizz.png",
      nombre: "SEGUNDO INTENTO",
      reproducciones: "30,000,000",
      duracion: "3:10",
      esFavorita: true,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 5,
      imagen: "logo_noizz.png",
      nombre: "Formentera",
      reproducciones: "25,000,000",
      duracion: "3:20",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    }
  ];

  canciones2 = [
    {
      ranking: 1,
      imagen: "logo_noizz.png",
      nombre: "GRAN VÍA",
      reproducciones: "69,698,951",
      duracion: "3:13",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 2,
      imagen: "logo_noizz.png",
      nombre: "Mon Amour - Remix",
      reproducciones: "50,000,000",
      duracion: "3:25",
      esFavorita: true,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 3,
      imagen: "logo_noizz.png",
      nombre: "Presiento",
      reproducciones: "45,000,000",
      duracion: "3:00",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 4,
      imagen: "logo_noizz.png",
      nombre: "SEGUNDO INTENTO",
      reproducciones: "30,000,000",
      duracion: "3:10",
      esFavorita: true,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 5,
      imagen: "logo_noizz.png",
      nombre: "Formentera",
      reproducciones: "25,000,000",
      duracion: "3:20",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 1,
      imagen: "logo_noizz.png",
      nombre: "GRAN VÍA",
      reproducciones: "69,698,951",
      duracion: "3:13",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 2,
      imagen: "logo_noizz.png",
      nombre: "Mon Amour - Remix",
      reproducciones: "50,000,000",
      duracion: "3:25",
      esFavorita: true,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 3,
      imagen: "logo_noizz.png",
      nombre: "Presiento",
      reproducciones: "45,000,000",
      duracion: "3:00",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 4,
      imagen: "logo_noizz.png",
      nombre: "SEGUNDO INTENTO",
      reproducciones: "30,000,000",
      duracion: "3:10",
      esFavorita: true,
      nombreArtisticoArtista: "Chiara Oliver"
    },
    {
      ranking: 5,
      imagen: "logo_noizz.png",
      nombre: "Formentera",
      reproducciones: "25,000,000",
      duracion: "3:20",
      esFavorita: false,
      nombreArtisticoArtista: "Chiara Oliver"
    }
  ];
  
  ngOnInit() {
    this.foto = this.tokenService.getUser().fotoPerfil;
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

}


