import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pendiente',
  imports: [],
  templateUrl: './pendiente.component.html',
  styleUrl: './pendiente.component.css'
})
export class PendienteComponent {



  constructor(private router: Router, private authService: AuthService,  private tokenService: TokenService,private notificationService: NotificationService) {}

  eliminarSolicitud(): void {
    this.router.navigate(['/pedirContrasenya']);
  }

  cerrarSesion(): void {
    this.authService.logout()
    .subscribe({
      next: () => {
        this.tokenService.clearStorage();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar la sesión:', error);
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
        console.log('Petición completada');
      }
    });
  }

}
