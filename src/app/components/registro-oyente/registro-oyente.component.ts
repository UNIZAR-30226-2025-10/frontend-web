import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para que funcione ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Component({
  selector: 'app-registro-oyente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-oyente.component.html',
  styleUrl: './registro-oyente.component.css'
})
export class RegistroOyenteComponent implements OnInit {

  email: string = '';
  nombreUsuario: string = '';
  password: string = '';
  esOyente: boolean = true;

  isPasswordVisible: boolean = false;
  isLetterValid: boolean = false;
  isNumberValid: boolean = false;
  isLengthValid: boolean = false;
  isFormValid: boolean = false;

  constructor(private router: Router) {}

  private http = inject(HttpClient);

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  validatePassword(): void {
    const value = this.password;
    this.isLetterValid = /[A-Za-z]/.test(value);
    this.isNumberValid = /[0-9#?!&]/.test(value);
    this.isLengthValid = value.length >= 10;

    this.isFormValid = this.isLetterValid && this.isNumberValid && this.isLengthValid;
  }

  onPasswordChange(): void {
    this.validatePassword();
  }

  ngOnInit(): void {
    // Acceder a los datos enviados desde la pantalla anterior
    const navigationState = history.state; 

    if (navigationState?.esOyente !== undefined) {
      this.esOyente = navigationState.esOyente;
      console.log('Datos recibidos:', this.esOyente);
    } else {
      console.log('No se recibieron datos de navegación.');
    }
  }

  onSubmit(): void {

    //ESTO ES LO Q HAY Q ENVIAR A LA API, LO MOSTRAMOS POR VER SI FUNCIONA
    console.log('Email:', this.email);
    console.log('Nombre Usuario:', this.nombreUsuario);
    console.log('Password:', this.password);
    console.log(`Es Oyente: ${this.esOyente}`);

    //AQUI HABRIA Q MANDARALO A LA API Y GESTIONAR LA RESPUESTA
    this.http.post('http://localhost:5000/register-oyente', { correo: this.email, nombreUsuario: this.nombreUsuario, contrasenya: this.password })
    .subscribe({
      //response es lo que devuelve la api (objeto, array...)
      next: (response) => {
        //AQUI HABRIA Q HACER CON ESA RESPUESTA LO QUE SE QUIERA, EN ESTE CASO SOLO LA MUESTRA EN LA CONSOLA POR HACER ALGO
        console.log('Respuesta de la API:', response);
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
