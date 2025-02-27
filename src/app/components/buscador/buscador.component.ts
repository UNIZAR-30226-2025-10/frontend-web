import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { ResultadosService } from '../../services/resultados.service';
import { LimpiarBuscadorService } from '../../services/limpiar-buscador.service';  // Ajusta la ruta según corresponda
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class BuscadorComponent {
  searchQuery: string = '';
  sidebarOpen = false;
  previousUrl: string = '';
  private subscription!: Subscription;

  @Output() searchResults = new EventEmitter<any>(); // Emitirá los resultados al componente padre

  constructor(private spotifyService: SpotifyService, private router: Router, private sidebarService: SidebarService, private resultadosService: ResultadosService, private limpiarBuscadorService: LimpiarBuscadorService) {}

  ngOnInit() {
    // Guardar la URL actual antes de la búsqueda
    this.previousUrl = this.router.url;

    this.subscription = this.limpiarBuscadorService.limpiarBuscador$.subscribe(data => {
      if (data === true) {
        // Aquí puedes limpiar el campo de búsqueda, por ejemplo
        this.searchQuery = '';  // Limpiar el input de búsqueda
      }
    });
  }



  ngOnDestroy(): void {
    // Nos desuscribimos para evitar pérdidas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAll() {
    if (this.searchQuery.trim() === '') {
      this.router.navigateByUrl(this.previousUrl);
    }
    if (this.searchQuery.trim() !== '') {
      this.spotifyService.getAll(this.searchQuery).subscribe({
        next: (data) => {
          this.searchResults.emit(data); // Emitimos los resultados al componente padre

          // Guardamos los resultados en el servicio antes de navegar
          this.resultadosService.setResultados(data);

          // Si hay resultados, navegamos a la nueva ruta
          this.router.navigate(['/home/resultados'], { queryParams: { search: this.searchQuery } });
        },
        error: (error) => {
          console.error('Error al obtener los datos', error);
        }
      });
    }
  }
  

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarService.toggleSidebar();
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}

