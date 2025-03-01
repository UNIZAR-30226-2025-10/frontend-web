import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para que funcione ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Importar FormsModule para trabajar con ngModel
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isPasswordVisible: boolean = false;

  constructor(private router: Router) {}

  private http = inject(HttpClient);

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {

    //AQUI SOLO MUESTRA LOS VALORES EN LA CONSOLA, PARA AHORA QUE NO HAY API TODAVIA
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    //AQUI LO Q SE SUPONE Q HAY Q HACER, MANDAR LOS VALORES A LA API Y MANEJAR LA RESPUESTA
    // Aquí estás enviando los valores del formulario a la API
    this.http.post('http://localhost:5000/login', { correo: this.email, contrasenya: this.password })
    .subscribe({
      //response es lo que devuelve la api (objeto, array...)
      next: (response) => {
        //AQUI HABRIA Q HACER CON ESA RESPUESTA LO QUE SE QUIERA, EN ESTE CASO SOLO LA MUESTRA EN LA CONSOLA POR HACER ALGO
        console.log('Respuesta de la API:', response);
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
