import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-mis-canciones',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-canciones.component.html',
  styleUrl: './mis-canciones.component.css'
})
export class MisCancionesComponent {

  misCanciones: any[] = [];

  constructor(private authService: AuthService,private tokenService: TokenService, private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    this.pedirMisCanciones();
  }

  pedirMisCanciones(): void {
    this.authService.pedirMisCancionesArtista()
      .subscribe({
        next: (response) => {
          this.misCanciones = response.canciones;
        },
        error: (error) => {
          console.error("Error al obtener las canciones:", error);
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
