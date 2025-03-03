import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opciones-registro',
  standalone: true,  
  imports: [],
  templateUrl: './opciones-registro.component.html',
  styleUrl: './opciones-registro.component.css'
})
export class OpcionesRegistroComponent {
  

  constructor(private router: Router) {} 

  onSubmit(tipo: string): void {
    if (tipo == 'artista') {
      this.router.navigate(['/registroArtista']);
    } else {
      this.router.navigate(['/registroOyente']);
    }
  }
}
