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

  constructor(private router: Router, private authService: AuthService, private tokenService: TokenService) {}

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  validatePassword(): void {
    const value = this.credentials.contrasenya;
    this.isLetterValid = /[A-Za-z]/.test(value);
    this.isNumberValid = /[0-9#?!&]/.test(value);
    this.isLengthValid = value.length >= 10;

    this.isFormValid = this.isLetterValid && this.isNumberValid && this.isLengthValid;
  }

  onPasswordChange(): void {
    this.validatePassword();
  }

  onSubmit(): void {

    //AQUI HABRIA Q MANDARALO A LA API Y GESTIONAR LA RESPUESTA
    this.authService.registerOyente(this.credentials)
    .subscribe({
      //response es lo que devuelve la api (objeto, array...)
      next: (response) => {
        //AQUI HABRIA Q HACER CON ESA RESPUESTA LO QUE SE QUIERA, EN ESTE CASO SOLO LA MUESTRA EN LA CONSOLA POR HACER ALGO
        console.log('Respuesta de la API:', response);
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.usuario);
        console.log('Token guardado: ', this.tokenService.getToken());
        console.log('User guardado: ', this.tokenService.getUser());
        this.router.navigate(['/home/home']);
      },
      error: (error) => {
        //SI ALGO FALLA, ERROR TIENE LA INFORMACION SOBRE EL ERROR
        console.error('Error al autenticar:', error);
      },
      complete: () => {
        //SE EJECUTA CAUNDO LA PETICION A TERMINADO YA SEA CON EXITO O NO. PARA HACER TAREAS COMO LIMPIAR RECURSOS O ESCRIBIR MENSAJES FINALES
        console.log('Petición completada');
      }
    });

    //CAMBIAR DE PANTALLA
  }
}
