import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para que funcione ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService} from '../../services/auth.service';
import { TokenService} from '../../services/token.service';

@Component({
  selector: 'app-registro-oyente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-oyente.component.html',
  styleUrl: './registro-oyente.component.css'
})
export class RegistroOyenteComponent {

  credentials= {correo:'', nombreUsuario:'', contrasenya:''};
 

  isPasswordVisible: boolean = false;
  isLetterValid: boolean = false;
  isNumberValid: boolean = false;
  isLengthValid: boolean = false;
  isFormValid: boolean = false;
  nombreUserCorrecto: boolean = false;
  correoCorrecto: boolean = false;

  errorMessage: string = '';
  correoError: string = '';
  nombreError: string = '';

  constructor(private router: Router, private authService: AuthService, private tokenService: TokenService) {}

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  validatePassword(): void {
    const value = this.credentials.contrasenya;
    const value2 = this.credentials.nombreUsuario;
    const value3 = this.credentials.correo;
    this.isLetterValid = /[A-Za-z]/.test(value);
    this.isNumberValid = /[0-9#?!&]/.test(value);
    this.isLengthValid = value.length >= 10;
    this.nombreUserCorrecto = !value2.includes("@") && !value2.includes(",") && value2 != "";
    this.correoCorrecto = value3.includes("@") &&  value3 !="";

    this.isFormValid = this.correoCorrecto && this.nombreUserCorrecto && this.isLetterValid && this.isNumberValid && this.isLengthValid;
  }

  onPasswordChange(): void {
    this.validatePassword();

    if (this.credentials.correo) {
      this.correoError = '';
    }

    if (this.credentials.nombreUsuario) {
      this.nombreError = '';
    }
  }

  onSubmit(): void {

    this.authService.registerOyente(this.credentials)
    .subscribe({
      next: (response) => {
        this.tokenService.clearStorage();
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.oyente);
        this.tokenService.setTipo(response.tipo);
        this.router.navigate(['/home/home']);
      },
      error: (error) => {
        console.error('Error al autenticar:', error);

        if (error.status === 409) {
          const errorResponse = error.error;  // Asumiendo que el mensaje de error está dentro de `error.error`

          // Si el error contiene un mensaje específico de correo ya en uso
          if (errorResponse.error.includes('correo')) {
            this.correoError = errorResponse.error; // Muestra el mensaje específico de correo
            this.errorMessage = ''; // Limpiar el mensaje genérico
          } else {
            this.correoError = ''; // Limpiar el mensaje de correo
          }

          // Si el error contiene un mensaje específico de nombre de usuario ya en uso
          if (errorResponse.error.includes('nombre')) {
            this.nombreError = errorResponse.error; // Muestra el mensaje específico de nombre de usuario
            this.errorMessage = ''; // Limpiar el mensaje genérico
          } else {
            this.nombreError = ''; // Limpiar el mensaje de nombre de usuario
          }

        } else {
          if (error.status === 400) {
            this.errorMessage = 'Faltan campos.';
            this.correoError = ''; 
            this.nombreError = '';  
          } else {
            this.errorMessage = 'Hubo un problema al procesar tu solicitud. Intenta más tarde.';
            this.correoError = ''; 
            this.nombreError = ''; 
          } 
        }
      },
      complete: () => {
        //SE EJECUTA CAUNDO LA PETICION A TERMINADO YA SEA CON EXITO O NO. PARA HACER TAREAS COMO LIMPIAR RECURSOS O ESCRIBIR MENSAJES FINALES
        console.log('Petición completada');
      }
    });
  }
}
