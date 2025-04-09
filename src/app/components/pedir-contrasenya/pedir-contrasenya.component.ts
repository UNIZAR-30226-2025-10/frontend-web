import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pedir-contrasenya',
  imports: [CommonModule, FormsModule],
  templateUrl: './pedir-contrasenya.component.html',
  styleUrl: './pedir-contrasenya.component.css'
})
export class PedirContrasenyaComponent {

  credentials= {contrasenya:''};
  
  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService,private notificationService: NotificationService) {}

  onSubmit(): void {

    this.authService.eliminarCuenta(this.credentials)
    .subscribe({
      next: () => {
        this.tokenService.clearStorage();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
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
