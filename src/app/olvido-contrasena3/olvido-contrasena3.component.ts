import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-olvido-contrasena3',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './olvido-contrasena3.component.html',
  styleUrl: './olvido-contrasena3.component.css'
})
export class OlvidoContrasena3Component {
  newpassword: string = '';

  constructor(private router: Router) {}

  private http = inject(HttpClient);

  onSubmit(): void {

    //AQUI SOLO MUESTRA LOS VALORES EN LA CONSOLA, PARA AHORA QUE NO HAY API TODAVIA
    console.log('Email:', this.newpassword);

    //AQUI LO Q SE SUPONE Q HAY Q HACER, MANDAR LOS VALORES A LA API Y MANEJAR LA RESPUESTA
    // Aquí estás enviando los valores del formulario a la API
    this.http.post('https://mi_api/login', { email: this.newpassword})
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
