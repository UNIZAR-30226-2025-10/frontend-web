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
  credentials = {correo: '', contrasenya:''};
  isPasswordVisible: boolean = false;

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {}


  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    //AQUI LO Q SE SUPONE Q HAY Q HACER, MANDAR LOS VALORES A LA API Y MANEJAR LA RESPUESTA
    
    // Aquí estás enviando los valores del formulario a la API
    this.authService.login(this.credentials)
    .subscribe({
      //response es lo que devuelve la api (objeto, array...)
      next: (response) => {
        //AQUI HABRIA Q HACER CON ESA RESPUESTA LO QUE SE QUIERA, EN ESTE CASO SOLO LA MUESTRA EN LA CONSOLA POR HACER ALGO
        console.log('Respuesta de la API:', response);
        this.tokenService.setToken(response.token);
        console.log('Token guardado: ', this.tokenService.getToken());
        this.router.navigate(['/homeApp']);
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
  
  }
}
