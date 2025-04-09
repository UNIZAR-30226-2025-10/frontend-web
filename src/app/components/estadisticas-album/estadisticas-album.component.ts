import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { NotificationService } from '../../services/notification.service';

interface Album {
  nombre: string;
  fotoPortada: string;
  nombreArtisticoArtista: string;
  fechaPublicacion: string;
  duracion: number;
  reproducciones: number;
  nPlaylists: number;
  favs: number;
  canciones: any[];
  minutos: number;
  segundos: string;
}

interface Cancion {
  id: number;
  nombre: string;
  duracion: number;
  reproducciones: number;
  fotoPortada: string;
  featuring: any[];
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

  album: Album = { nombre: '', fotoPortada: '', nombreArtisticoArtista: '', fechaPublicacion: '', duracion: 0, reproducciones: 0, nPlaylists:0, favs: 0, canciones: [], minutos:0, segundos:''};

  //PARA LA EDICION DEL ALBUM
  nombreActual: string = '';
  foto: string ='';
  fotoNueva!: string;
  file!: File;

  usuarios: any[]= [];
  tokenService: any;

  constructor( private route: ActivatedRoute, private location: Location, private authService: AuthService, private subirCloudinary: SubirCloudinary, private router: Router, private notificationService: NotificationService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {

    const idAlbum = this.route.snapshot.paramMap.get('id'); 
    if (idAlbum) {
      this.currentIdAlbum = idAlbum;
    }

    this.authService.pedirEstadisticasAlbum(this.currentIdAlbum)
    .subscribe({
      next: (response) => {   
        this.album.nombre = response.nombre;
        this.album.fotoPortada = response.fotoPortada;
        this.nombreActual = this.album.nombre;
        this.foto = this.album.fotoPortada;
        this.fotoNueva = this.foto;
        this.album.nombreArtisticoArtista = response.nombreArtisticoArtista
        this.album.duracion = response.duracion
        this.album.reproducciones = response.reproducciones
        this.album.favs = response.favs
        this.album.nPlaylists = response.nPlaylists
        this.album.fechaPublicacion = this.formatearFecha(response.fechaPublicacion)

        //Ajustar duración album
        this.album.minutos = Math.floor(response.duracion / 60);
        const segundosRestantes = response.duracion % 60;
        this.album.segundos = segundosRestantes.toString().padStart(2, "0");

        //Ajustar formato de la fecha del album
        this.album.fechaPublicacion = this.formatearFecha(response.fechaPublicacion);

        //Ajustar duración canciones
        this.album.canciones = response.canciones.map((cancion: Cancion) => ({
          ...cancion,
          
          duracion: this.convertirTiempo(cancion.duracion)
          //featuring: cancion.featuring.length ? ` ${cancion.featuring.join(', ')}` : ''
        }));

      },
      error: (error) => {
        console.error("Error al recibir los datos del álbum:", error);
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
  
    // Extraer nombres de canciones y reproducciones del álbum
    const labels = this.album.canciones.map((cancion: { nombre: string }) => cancion.nombre);
    const data = this.album.canciones.map((cancion: { reproducciones: number }) => cancion.reproducciones);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Reproducciones",
          data: data,
          backgroundColor: [
            "#34495E", "#2C3E50", "#7F8C8D", "#95A5A6", "#BDC3C7",
            "#ECF0F1", "#1ABC9C", "#16A085", "#8E44AD", "#2980B9"
          ].slice(0, labels.length),
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
  

    this.chartPie = new Chart(ctxPie, {
      type: 'pie', // Tipo 'pie' para gráfico de pastel
      data: {
        labels: labels,
        datasets: [{
          label: "Reproducciones",
          data: data,
          backgroundColor: [
            "#34495E", "#2C3E50", "#7F8C8D", "#95A5A6", "#BDC3C7",
            "#ECF0F1", "#1ABC9C", "#16A085", "#8E44AD", "#2980B9"
          ].slice(0, labels.length),
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
    if (this.usuarios.length === 0) {
      this.authService.pedirMeGustasAlbum(this.currentIdAlbum)
      .subscribe({
        next: (response) => { 
          this.usuarios = response.oyentes_favs;
          this.verMeGustas=true;
        },
        error: (error) => {
          console.error("Error al recibir los perfiles que han dado me gusta a la cancion:", error);
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
          console.log("Perfiles recibidos con éxito");
        }
      });
    } else {
      this.verMeGustas=true;
    }
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
          // No esta logeado
          if (error.status === 401) {
            this.tokenService.clearStorage();
            this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); 
          }
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
        console.log("Álbum eliminado con éxito");
      }
    });
  }

  verEstadisticas(id: any) {
    this.router.navigate(['/home/estadisticasCancion', id]);
  }
}
