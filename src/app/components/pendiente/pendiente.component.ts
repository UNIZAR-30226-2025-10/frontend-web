import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-pendiente',
  imports: [],
  templateUrl: './pendiente.component.html',
  styleUrl: './pendiente.component.css'
})
export class PendienteComponent {



  constructor(private router: Router, private authService: AuthService,  private tokenService: TokenService) {}

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
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

}
