import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { SidebarService } from '../../services/sidebar.service';
import { RouterModule } from '@angular/router';

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

  users = [
    { name: 'Usuario 1', img: 'https://randomuser.me/api/portraits/men/16.jpg', status: 'status-red' },
    { name: 'Usuario 2', img: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'status-red' },
    { name: 'Usuario 3', img: 'https://randomuser.me/api/portraits/men/3.jpg', status: 'status-red' },
    { name: 'Usuario 4', img: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'status-red' },
    { name: 'Usuario 5', img: 'https://randomuser.me/api/portraits/men/5.jpg', status: 'status-red' },
    { name: 'Usuario 6', img: 'https://randomuser.me/api/portraits/women/92.jpg', status: 'status-red' },
    { name: 'Usuario 7', img: 'https://randomuser.me/api/portraits/men/6.jpg', status: 'status-red' },
    { name: 'Usuario 8', img: 'https://randomuser.me/api/portraits/women/4.jpg', status: 'status-red' },
    { name: 'Usuario 9', img: 'https://randomuser.me/api/portraits/men/8.jpg', status: 'status-red' },
    { name: 'Usuario 10', img: 'https://randomuser.me/api/portraits/men/23.jpg', status: 'status-red' }
  ];

  @Output() searchResults = new EventEmitter<any>(); // Emitirá los resultados al componente padre

  constructor(private spotifyService: SpotifyService, private router: Router,private sidebarService: SidebarService) {}

  getAll() {
    if (this.searchQuery.trim() !== '') {
      this.spotifyService.getAll(this.searchQuery).subscribe({
        next: (data) => {
          this.searchResults.emit(data); 
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

