import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {TokenService} from '../../services/token.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-introducir-codigo',
  imports: [CommonModule, FormsModule],
  templateUrl: './introducir-codigo.component.html',
  styleUrl: './introducir-codigo.component.css'
})
export class IntroducirCodigoComponent {
  credentials = {codigo:''};
  errorMessage = '';
  code: string ='';

  isPasswordVisible: boolean = false;

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private tokenService: TokenService,private notificationService: NotificationService) {}

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    this.authService.enviarCodigoArtista(this.credentials)
    .subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.artista_valido);
        this.tokenService.setTipo(response.tipo);
        this.router.navigate(['/home/home']);
      },
      error: (error) => {
        console.error('Error al autenticar el código:', error);

        if (error.status === 400) {
          this.errorMessage = 'Código incorrecto.';
        } 
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
