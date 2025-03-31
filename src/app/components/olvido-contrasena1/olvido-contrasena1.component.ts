import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para que funcione ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Importar FormsModule para trabajar con ngModel
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-olvido-contrasena1',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './olvido-contrasena1.component.html',
  styleUrl: './olvido-contrasena1.component.css'
})
export class OlvidoContrasena1Component {
  credentials = {correo:''};
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}



  onSubmit(): void {
  
    this.authService.enviarCorreo(this.credentials)
    .subscribe({
      next: () => {
        this.router.navigate(['/olvidoContrasena2'], {state: { correo: this.credentials.correo }} );
      },
      error: (error) => {
        console.error('Error al verificar el correo:', error);
        if (error.status === 400) {
          this.errorMessage = 'Correo electrónico no válido.';
        } 
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }
}
