import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para que funcione ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Importar FormsModule para trabajar con ngModel
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correoOusuario: string = '';
  credentials: { correo?: string; nombreUsuario?: string; contrasenya: string } = { contrasenya: '' };
  isPasswordVisible: boolean = false;

  errorMessage: string = '';
  errorType: string = '';

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {}


  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.correoOusuario.includes('@')) {
      this.credentials = { correo: this.correoOusuario, contrasenya: this.credentials.contrasenya };
    } else {
      this.credentials = { nombreUsuario: this.correoOusuario, contrasenya: this.credentials.contrasenya };
    }
    
    this.authService.login(this.credentials)
    .subscribe({
      next: (response) => {
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.usuario);
        this.tokenService.setTipo(response.tipo);
        console.error('DATOS:', response);
        if (response.tipo === "pendiente") {
          this.router.navigate(['/pendiente']);
        } else if (response.tipo === "valido") {
          this.router.navigate(['/introducirCodigo']);
        } else if (response.tipo === "admin") {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home/home']);
        }
      },
      error: (error) => {
        //SI ALGO FALLA, ERROR TIENE LA INFORMACION SOBRE EL ERROR
        console.error('Error al autenticar:', error);

        if (error.status === 401) {
          if (error.error.error.includes('incorrecta')) {
            this.errorMessage = 'Contraseña incorrecta.';  // Error de contraseña
            this.errorType = 'password';
          } else if (error.error.error.includes('correo') || error.error.error.includes('correo')) {
            this.errorMessage = 'Nombre de usuario o correo no válido.';  // Error de usuario/correo
            this.errorType = 'user';
          }
        } else {
          // En caso de otros errores
          this.errorMessage = 'Hubo un problema al procesar tu solicitud. Intenta más tarde.';
          this.errorType = 'general';
        }


      },
      complete: () => {
        //SE EJECUTA CAUNDO LA PETICION A TERMINADO YA SEA CON EXITO O NO. PARA HACER TAREAS COMO LIMPIAR RECURSOS O ESCRIBIR MENSAJES FINALES
        console.log('Petición completada');
      }
    });
  
  }
}
