import { Component, Input, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';


interface Cancion {
  id: number;
  nombre: string;
  duracion: number;
  album: string;
  fotoPortada: string;
  featuring: any[];
  fecha: string;
}

@Component({
  selector: 'app-canciones-favs',
  imports: [FormsModule, CommonModule],
  templateUrl: './canciones-favs.component.html',
  styleUrl: './canciones-favs.component.css'
})
export class CancionesFavsComponent implements OnInit {

  currentArtista: string = '';
  currentNombreArtistico: string = '';
  canciones: any[] = [];

  openDropdown: number | null = null;
  dropdownTopPosition: number = 0; 
  dropdownLeftPosition: number = 0;
  hoverIndex: number | null = null;
  tokenService: any;
  router: any;
  
  constructor(private authService: AuthService, private route: ActivatedRoute,private notificationService: NotificationService) {}

  ngOnInit(): void {

    const nombreArtista = this.route.snapshot.paramMap.get('nombreUsuario'); 
    if (nombreArtista) {
      this.currentArtista = nombreArtista;
    }

    this.route.queryParams.subscribe(params => {
      const nombreArtistico = params['nombreArtistico'];
      this.currentNombreArtistico = nombreArtistico;
    });

    this.authService.pedirCancionesFavsArtista(this.currentArtista)
    .subscribe({
      next: (response) => {   
        this.canciones = response.canciones_favoritas;
        
        this.canciones = response.canciones_favoritas.map((cancion: Cancion) => ({
          ...cancion,
          duracion: this.convertirTiempo(cancion.duracion),
          featuring: cancion.featuring.length ? ` ${cancion.featuring.join(', ')}` : '',
          fecha: this.formatearFecha(cancion.fecha)
        }));
      },
      error: (error) => {
        console.error("Error al recibir los datos de las canciones:", error);
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
        console.log("Datos de las canciones recibidos con éxito");
      }
    });
  }

  convertirTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    
    return `${minutos}:${segundosRestantes.toString().padStart(2, "0")}`;
  }

  formatearFecha(fecha: string): string {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    const partes = fecha.split(" "); // Divide la fecha (ej. "27 03 2025")
    if (partes.length !== 3) return fecha; // Si el formato no es válido, devuelve la original
    
    const dia = partes[0];
    const mes = meses[parseInt(partes[1], 10) - 1]; // Convierte "03" en índice 2 -> "Marzo"
    const año = partes[2];
  
    return `${dia} ${mes} ${año}`;
  }

  abrirDesplegable(index: number) {
    if (this.openDropdown === index) {
      this.openDropdown = null;
    } else {
      
      this.calcularPosicionDropdown(index);
      this.openDropdown = index;
    }
  }

  calcularPosicionDropdown(index: number): void {
    const button = document.getElementsByClassName('tres_puntos')[index] as HTMLElement;
    const rect = button.getBoundingClientRect();  // Obtiene la posición del botón
    this.dropdownTopPosition = rect.bottom + window.scrollY;  // Calcula la posición top
    this.dropdownLeftPosition = rect.left + window.scrollX -105;  // Calcula la posición left
  }

  playSong(id:any) {}

}
