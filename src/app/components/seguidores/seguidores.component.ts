import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-seguidores',
  imports: [RouterModule, CommonModule],
  templateUrl: './seguidores.component.html',
  styleUrls: ['./seguidores.component.css']
})
export class SeguidoresComponent {
  
  seguidores: any[] = [];
  filteredSeguidos: any[] = [];
  activeFilter: string = 'all';
  tokenService: any;
  router: any;

  constructor(private authService: AuthService,private notificationService: NotificationService) {}
  

  ngOnInit() {

    this.authService.pedirMisSeguidores()
    .subscribe({
      next: (response) => {   
        this.seguidores = response.seguidores;
        this.filterFollows(this.activeFilter);
      },
      error: (error) => {
        console.error("Error al recibir los datos de la cancion:", error);
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
        console.log("Datos de la cancion recibidos con éxito");
      }
    });
    
  }

  filterFollows(filter: string) {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.filteredSeguidos = this.seguidores;
    } else if (filter === 'artists') {
      this.filteredSeguidos = this.seguidores.filter(seguido=> seguido.tipo === 'artista');
    }
  }

  isActive(filter: string): boolean {
    return this.activeFilter === filter;
  }
}