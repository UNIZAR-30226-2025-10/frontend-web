import { Component, AfterViewInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas-album',
  imports: [CommonModule],
  templateUrl: './estadisticas-album.component.html',
  styleUrl: './estadisticas-album.component.css'
})
export class EstadisticasAlbumComponent implements AfterViewChecked {

  @ViewChild('graficoCanciones') canvas!: ElementRef;
  @ViewChild('graficoPie') canvasPie!: ElementRef;
  chart!: Chart;
  chartPie!: Chart;

  verDetalles: boolean=false;
  verMeGustas: boolean=false;

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

  constructor() {
    Chart.register(...registerables);
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
          backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c", "#16a085", "#f39c12", "#d35400", "#8e44ad"],
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
          backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c", "#16a085", "#f39c12", "#d35400", "#8e44ad"],
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
}
