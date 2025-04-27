import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-top-artistas',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './top-artistas.component.html',
  styleUrl: './top-artistas.component.css'
})
export class TopArtistasComponent {

  ultimosArtistas: any[] = [];

  constructor(private authService: AuthService,private tokenService: TokenService,private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    this.pedirTodosArtistas();
  }

  pedirTodosArtistas(): void {
    this.authService.pedirTopArtistas()
      .subscribe({
        next: (response) => {
          this.ultimosArtistas = response.historial_artistas;
          console.log("Artistas recibidos:", response);
        },
        error: (error) => {
          console.error("Error al obtener los artistas:", error);
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
        }
      });
  }

}
