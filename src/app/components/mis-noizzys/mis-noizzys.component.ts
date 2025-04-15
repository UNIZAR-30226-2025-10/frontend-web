import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';

@Component({
  selector: 'app-mis-noizzys',
  imports: [RouterModule, CommonModule],
  templateUrl: './mis-noizzys.component.html',
  styleUrls: ['./mis-noizzys.component.css']
})
export class MisNoizzysComponent implements OnInit {
  noizzys: any[] = []; 
  textoPostNoizzy: string = ''; 
  idPostNoizzy: string | null = null; 
  isModalNoizzyOpen: boolean = false;
  isModalCancionOpen: boolean = false; 
  busquedaCancion: string = ''; 
  resultadosBusqueda: any[] = [];


  constructor(private authService: AuthService,  private subirCloudinary: SubirCloudinary) {}

  ngOnInit(): void {
    this.cargarMisNoizzys();
  }

  cargarMisNoizzys(): void {
    this.authService.pedirMisNoizzys().subscribe({
      next: (response) => {
        this.noizzys = response.noizzys; 
      },
      error: (err) => {
        console.error('Error al cargar los Noizzys:', err);
      }
    });
  }

  darLike(like: boolean, idNoizzy: string): void {
    this.authService.likearNoizzy(!like, idNoizzy).subscribe({
      next: (response) => {
        this.cargarMisNoizzys(); 
      },
      error: (err) => {
        console.error('Error al dar like:', err);
      }
    });
  }
  
  abrirModalNoizzy(): void {
    this.isModalNoizzyOpen = true;
  }

  cerrarModalNoizzy(): void {
    this.isModalNoizzyOpen = false;
  }
  
  abrirModalCancion(): void {
    this.isModalCancionOpen = true;
  }

  cerrarModalCancion(): void {
    this.isModalCancionOpen = false;
  }
  
  publicarNoizzy(): void {
    if (!this.textoPostNoizzy.trim()) {
      alert('El texto del Noizzy no puede estar vacío.');
      return;
    }
    
    this.authService.publicarNoizzy(this.textoPostNoizzy, this.idPostNoizzy).subscribe({
      next: (response) => {
        this.textoPostNoizzy = ''; 
        this.idPostNoizzy = null; 
        this.cargarMisNoizzys(); 
        this.cerrarModalNoizzy(); 
      },
      error: (err) => {
        console.error('Error al publicar el Noizzy:', err);
      }
    });
  }

   // Método para manejar el evento de entrada en el campo de texto
  onTextoNoizzyInput(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    this.textoPostNoizzy = inputElement.value; 
  }

  onBusquedaCancionInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.busquedaCancion = inputElement.value; 
  }

  buscarCancion(): void {
    if (!this.busquedaCancion.trim()) {
      alert('Por favor, introduce un término de búsqueda.');
      return;
    }

    this.authService.buscador(this.busquedaCancion).subscribe({
      next: (response) => {
        this.resultadosBusqueda = response.canciones || [];
      },
      error: (err) => {
        console.error('Error al buscar canciones:', err);
      }
    });
  }

  seleccionarCancion(cancion: any): void {
    console.log('Canción seleccionada:', cancion);
    this.cerrarModalCancion();
  }
}