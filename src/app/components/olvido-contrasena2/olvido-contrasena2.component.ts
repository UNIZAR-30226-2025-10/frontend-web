import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-olvido-contrasena2',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './olvido-contrasena2.component.html',
  styleUrl: './olvido-contrasena2.component.css'
})
export class OlvidoContrasena2Component implements OnInit {
  credentials = {correo:'', codigo:''};
  errorMessage = '';

  isPasswordVisible: boolean = false;

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.credentials.correo = params['correo'];
    });
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {

    this.authService.enviarCodigo(this.credentials)
    .subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        this.tokenService.setToken(response.token_temporal);
        this.router.navigate(['/olvidoContrasena3', this.credentials.correo]);
      },
      error: (error) => {
        console.error('Error al autenticar el código:', error);

        if (error.status === 400) {
          this.errorMessage = 'Código incorrecto.';
        } 
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }

}
