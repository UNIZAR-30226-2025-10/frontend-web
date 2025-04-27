import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
  usuario:any;

  constructor(private route: ActivatedRoute,private authService: AuthService,private router: Router,private notificationService: NotificationService) {}
  

  ngOnInit() {
    const nombreUsuario = this.route.snapshot.paramMap.get('nombreUsuario'); 
    if (nombreUsuario) {
      this.usuario = nombreUsuario;
      this.authService.pedirSeguidoresOtro(this.usuario)
      .subscribe({
        next: (response) => {   
          this.seguidores = response.seguidores;
          this.filterFollows(this.activeFilter);
        },
        error: (error) => {
          console.error("Error al recibir los seguidores:", error);
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
          console.log("Seguidores recibidos con éxito");
        }
      });
      
    } else{
      this.authService.pedirMisSeguidores()
      .subscribe({
        next: (response) => {   
          this.seguidores = response.seguidores;
          this.filterFollows(this.activeFilter);
        },
        error: (error) => {
          console.error("Error al recibir los seguidores:", error);
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
          console.log("Seguidores recibidos con éxito");
        }
      });
    }

    
    
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