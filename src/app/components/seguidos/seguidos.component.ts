import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
  tokenService: any;
  usuario: any;

  constructor(private route: ActivatedRoute,private router: Router, private authService: AuthService, private notificationService: NotificationService) {}
  

  ngOnInit() {
    const nombreUsuario = this.route.snapshot.paramMap.get('nombreUsuario'); 
    if (nombreUsuario) {
      this.usuario = nombreUsuario;
      this.authService.pedirSeguidosOtro(this.usuario)
      .subscribe({
        next: (response) => {   
          this.seguidos = response.seguidos;
          this.filterFollows(this.activeFilter);
        },
        error: (error) => {
          console.error("Error al recibir los seguidos:", error);
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
          console.log("Seguidos recibidos con éxito");
        }
      });
    } else{
      this.authService.pedirMisSeguidos()
      .subscribe({
        next: (response) => {   
          this.seguidos = response.seguidos;
          this.filterFollows(this.activeFilter);
        },
        error: (error) => {
          console.error("Error al recibir los seguidos de la cancion:", error);
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
          console.log("Seguidos recibidos con éxito");
        }
      });

    }  
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