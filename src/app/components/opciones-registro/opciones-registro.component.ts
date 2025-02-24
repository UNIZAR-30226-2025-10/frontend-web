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
  
  esOyente: boolean = true;

  constructor(private router: Router) {} 

  onSubmit(tipo: string): void {
    if (tipo == 'artista') {
      this.esOyente = false;

      //ESTO ES SOLO PARA VER EN LA CONSOLA SI ESTA FUNCIONANDO
      console.log(`Es Oyente: ${this.esOyente}`);

      this.router.navigate(['/registroArtista'], {
        state: { esOyente: this.esOyente} 
      });
    } else {
        //ESTO ES SOLO PARA VER EN LA CONSOLA SI ESTA FUNCIONANDO
        console.log(`Es Oyente: ${this.esOyente}`);

        this.router.navigate(['/registroOyente'], {
          state: { esOyente: this.esOyente} 
        });
    }
  }
}
