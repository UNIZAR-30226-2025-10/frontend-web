import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { switchMap } from 'rxjs/operators';

interface Cancion {
  id: number;
  nombre: string;
  duracion: number;
  reproducciones: number;
  fotoPortada: string;
  //AÑADIR LO QUE SEA
}

@Component({
  selector: 'app-estadisticas-album',
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas-album.component.html',
  styleUrl: './estadisticas-album.component.css'
})
export class EstadisticasAlbumComponent implements OnInit, AfterViewChecked {

  @ViewChild('graficoCanciones') canvas!: ElementRef;
  @ViewChild('graficoPie') canvasPie!: ElementRef;
  chart!: Chart;
  chartPie!: Chart;

  verDetalles: boolean=false;
  verMeGustas: boolean=false;
  isModalOpen = false;
  isModalEliminarOpen: boolean = false;
  openDropdown: number | null = null;
  dropdownTopPosition: number = 0; 
  dropdownLeftPosition: number = 0;
  currentIdAlbum: string = '';
  album: any = {};

  //PARA LA EDICION DEL ALBUM
  nombreActual: string = '';
  foto: string ='';
  fotoNueva!: string;
  file!: File;

  usuarios = [
    { nombre: "Juan Pérez", foto: "nouser.png" },
    { nombre: "Ana Gómez", foto: "nouser.png" },
    { nombre: "Carlos López", foto: "nouser.png" },
    { nombre: "Maria Rodríguez", foto: "nouser.png" },
    { nombre: "Pedro Sánchez", foto: "nouser.png" },
    { nombre: "Juan Pérez", foto: "nouser.png" },
    { nombre: "Ana Gómez", foto: "nouser.png" },
    { nombre: "Carlos López", foto: "nouser.png" },
    { nombre: "Maria Rodríguez", foto: "nouser.png" },
    { nombre: "Pedro Sánchez", foto: "nouser.png" }
  ];

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

  constructor( private route: ActivatedRoute, private location: Location, private authService: AuthService, private subirCloudinary: SubirCloudinary) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {

    const idAlbum = this.route.snapshot.paramMap.get('id'); 
    if (idAlbum) {
      this.currentIdAlbum = idAlbum;
    }

    this.authService.datosAlbum(this.currentIdAlbum)
    .subscribe({
      next: (response) => {   
        this.album = response.album;
        this.nombreActual = this.album.nombre;
        this.foto = this.album.fotoPortada;
        this.fotoNueva = this.foto;

        //Ajustar duración album
        this.album.minutos = Math.floor(response.album.duracion / 60);
        const segundosRestantes = response.album.duracion % 60;
        this.album.segundos = segundosRestantes.toString().padStart(2, "0");

        //Ajustar formato de la fecha del album
        this.album.fechaPublicacion = this.formatearFecha(response.album.fechaPublicacion);

        //Ajustar duración canciones
        this.album.canciones = response.album.canciones.map((cancion: Cancion) => ({
          ...cancion,
          duracion: this.convertirTiempo(cancion.duracion)
        }));
      },
      error: (error) => {
        console.error("Error al recibir los datos del álbum:", error);
      },
      complete: () => {
        console.log("Datos recibidos con éxito");
      }
    });
  }

  formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(fecha);
  }

  convertirTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    
    return `${minutos}:${segundosRestantes.toString().padStart(2, "0")}`;
  }

  ngAfterViewChecked() {
    if (this.verDetalles && this.canvas && this.canvasPie && !this.chart && !this.chartPie) {
      this.crearGraficos();
    }
  }

  abrirDetalles(){
    this.verDetalles = true;
    if (this.verDetalles && this.canvas && this.canvasPie && !this.chart && !this.chartPie) {
      this.crearGraficos();
    }
  }

  cerrarDetalles(){
    this.verDetalles = false;
    if (this.chart) {
      this.chart = undefined!;
    }
    if (this.chartPie) {
      this.chartPie = undefined!;
    }
  }

  crearGraficos() {
    if (!this.canvas || !this.canvasPie) {
      console.error("Los canvas no están disponibles todavía.");
      return;
    }

    const ctx = this.canvas.nativeElement.getContext('2d');
    const ctxPie = this.canvasPie.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Canción 1", "Canción 2", "Canción 3", "Canción 4", "Canción 5", "Canción 6", "Canción 7", "Canción 8", "Canción 9", "Canción 10"],
        datasets: [{
          label: "Reproducciones",
          data: [1050000, 870000, 650000, 920000, 780000, 1050000, 870000, 650000, 920000, 780000],
          backgroundColor: [
            "#34495E", "#2C3E50", "#7F8C8D", "#95A5A6", "#BDC3C7",
            "#ECF0F1", "#1ABC9C", "#16A085", "#8E44AD", "#2980B9"
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true, // Mantén el texto visible
            labels: {
              usePointStyle: true,  // Usar estilo de punto en lugar del cuadro
              boxWidth: 0  // Elimina el cuadro de color
            }
          }
        }
      }
    });

    this.chartPie = new Chart(ctxPie, {
      type: 'pie', // Tipo 'pie' para gráfico de pastel
      data: {
        labels: ["Canción 1", "Canción 2", "Canción 3", "Canción 4", "Canción 5", "Canción 6", "Canción 7", "Canción 8", "Canción 9", "Canción 10"],
        datasets: [{
          label: "Reproducciones",
          data: [1050000, 870000, 650000, 920000, 780000, 1050000, 870000, 650000, 920000, 780000],
          backgroundColor: [
            "#34495E", "#2C3E50", "#7F8C8D", "#95A5A6", "#BDC3C7",
            "#ECF0F1", "#1ABC9C", "#16A085", "#8E44AD", "#2980B9"
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              boxWidth: 0
            }
          }
        }
      }
    });
  }

  abrirMeGustas() {
    this.verMeGustas=true;
  }

  cerrarMeGustas() {
    this.verMeGustas=false;
  }

  abrirModal() {
    this.isModalOpen = true;
  }

  abrirModalEliminar() {
    this.isModalEliminarOpen = true;
  }

  cerrarModal() {
    this.nombreActual = this.album.nombre;
    this.fotoNueva = this.foto;
    this.isModalOpen = false;
  }

  cerrarModalEliminar() {
    this.isModalEliminarOpen = false;
  }

  guardarCambios() {
    if (this.fotoNueva !== this.foto) {
      this.subirCloudinary.uploadFile(this.file, 'albumes').pipe(
        switchMap((url) => {
          console.log('Imagen subida:', url);
          this.fotoNueva = url;
          return this.authService.cambiarDatosAlbum(this.currentIdAlbum, this.nombreActual, this.fotoNueva);
        })
      ).subscribe({
        next: () => {
          this.album.nombre = this.nombreActual;
          this.foto = this.fotoNueva;
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al guardar los nuevos datos:", error);
          this.nombreActual = this.album.nombre;
          this.fotoNueva = this.foto;
        },
        complete: () => {
          console.log("Datos guardados con éxito");
        }
      });
    } else {
      // Si la foto no cambió, solo actualizamos los datos del álbum
      this.authService.cambiarDatosAlbum(this.currentIdAlbum, this.nombreActual, this.fotoNueva).subscribe({
        next: () => {
          this.album.nombre = this.nombreActual;
          this.foto = this.fotoNueva;
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al guardar los nuevos datos:", error);
          this.nombreActual = this.album.nombre;
          this.fotoNueva = this.foto;
        },
        complete: () => {
          console.log("Datos guardados con éxito");
        }
      });
    }
  }
  

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoNueva = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  abrirDesplegable(index: number) {
    if (this.openDropdown === index) {
      this.openDropdown = null;
    } else {
      this.openDropdown = index;
      this.calcularPosicionDropdown(index);
    }
  }

  calcularPosicionDropdown(index: number): void {
    const button = document.getElementsByClassName('tres_puntos')[index] as HTMLElement;
    const rect = button.getBoundingClientRect();  // Obtiene la posición del botón
    this.dropdownTopPosition = rect.bottom + window.scrollY;  // Calcula la posición top
    this.dropdownLeftPosition = rect.left + window.scrollX -105;  // Calcula la posición left
  }

  eliminarAlbum() {
    this.authService.eliminarAlbum(this.currentIdAlbum)
    .subscribe({
      next: () => {   
        this.isModalEliminarOpen = false;
        this.location.back();
      },
      error: (error) => {
        console.error("Error al eliminar el álbum:", error);
      },
      complete: () => {
        console.log("Álbum eliminado con éxito");
      }
    });

  }
}
