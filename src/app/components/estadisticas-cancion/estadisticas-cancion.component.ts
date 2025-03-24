import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas-cancion',
  imports: [CommonModule],
  templateUrl: './estadisticas-cancion.component.html',
  styleUrl: './estadisticas-cancion.component.css'
})
export class EstadisticasCancionComponent implements OnInit{

  foto: string ='';

  verPlaylists: boolean=false;
  verMeGustas: boolean=false;

  usuarios = [
    { nombre: "Juan Pérez", foto: "nouser.png" },
    { nombre: "Ana Gómez", foto: "nouser.png" },
    { nombre: "Carlos López", foto: "nouser.png" },
    { nombre: "Maria Rodríguez", foto: "nouser.png" },
    { nombre: "Pedro Sánchez", foto: "nouser.png" },
    { nombre: "Juan Pérez", foto: "nouser.png" },
    { nombre: "Ana Gómez", foto: "nouser.png" },
    { nombre: "Carlos López", foto: "nouser.png" },
    { nombre: "Maria Rodríguez", foto: "nouser.png" },
    { nombre: "Pedro Sánchez", foto: "nouser.png" }
  ];

  playlists = [
    { nombre: "Mix Rock", fotoPortada: "logo_noizz.png", nombreCreador: "Laurita03"},
    { nombre: "Mix Pop", fotoPortada: "logo_noizz.png",  nombreCreador: "Laurita03"},
    { nombre: "Para estudiar", fotoPortada: "logo_noizz.png", nombreCreador: "Laurita03" },
    { nombre: "Mix Country", fotoPortada: "logo_noizz.png",  nombreCreador: "Laurita03"},
    { nombre: "Mix Techno", fotoPortada: "logo_noizz.png",  nombreCreador: "Laurita03"},
    { nombre: "Mix Soft", fotoPortada: "logo_noizz.png", nombreCreador: "Laurita03" },
    { nombre: "Para dormir", fotoPortada: "logo_noizz.png",  nombreCreador: "Laurita03"}
  ];

  ngOnInit(): void {
    this.foto = "logo_noizz.png" //PONER FOTO DEL ALBUM
  }

  abrirMeGustas() {
    this.verMeGustas=true;
  }

  cerrarMeGustas() {
    this.verMeGustas=false;
  }

  abrirPlaylists() {
    this.verPlaylists=true;
  }

  cerrarPlaylists() {
    this.verPlaylists=false;
  }

}
