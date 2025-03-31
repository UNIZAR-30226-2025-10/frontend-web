import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-seguidos',
  imports: [RouterModule, CommonModule],
  templateUrl: './seguidos.component.html',
  styleUrls: ['./seguidos.component.css']
})
export class SeguidosComponent {
  
  seguidos: any[] = [];
  filteredSeguidos: any[] = [];
  activeFilter: string = 'all';

  constructor(private authService: AuthService) {}
  

  ngOnInit() {

    this.authService.pedirMisSeguidos()
    .subscribe({
      next: (response) => {   
        this.seguidos = response.seguidos;
        this.filterFollows(this.activeFilter);
      },
      error: (error) => {
        console.error("Error al recibir los datos de la cancion:", error);
      },
      complete: () => {
        console.log("Datos de la cancion recibidos con éxito");
      }
    });
    
  }

  filterFollows(filter: string) {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.filteredSeguidos = this.seguidos;
    } else if (filter === 'artists') {
      this.filteredSeguidos = this.seguidos.filter(seguido=> seguido.tipo === 'artista');
    }
  }

  isActive(filter: string): boolean {
    return this.activeFilter === filter;
  }
}