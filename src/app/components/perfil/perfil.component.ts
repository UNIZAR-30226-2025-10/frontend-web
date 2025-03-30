import { Component, OnInit, EventEmitter, Output, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

interface datosOyente {
  nombre: string;
  foto: string;
  nSeguidores: number;
  nSeguidos: number;
  listasPublicas: number;
  siguiendo: boolean;
}

interface Noizzy {
  texto: string | null;
  id: number;
  fecha: string;
  like: boolean;
}


@Component({
  selector: 'app-perfil',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  foto: string ='';
  mostrarBarra: boolean = false;
  currentUser: string =  '';
  oyente: datosOyente = { nombre: '', foto:'', nSeguidores: 0, nSeguidos: 0, listasPublicas:0, siguiendo: false};
  ultimoNoizzy: Noizzy = { texto: '', id: 0, fecha: '', like: false};


  @ViewChild('barraSuperior', { static: false }) topBar!: ElementRef<HTMLElement>;

  constructor(private el: ElementRef, private authService: AuthService, private tokenService: TokenService, private router: Router,  private route: ActivatedRoute){}

  misPlaylist = [
    {
        fotoPortada: "logo_noizz.png",
        nombre: "Rock Clásico"
    },
    {
        fotoPortada: "logo_noizz.png",
        nombre: "Pop Hits"
    },
    {
        fotoPortada: "logo_noizz.png",
        nombre: "Indie Vibes"
    }
  ];

  seguidos = [
    {
        fotoPerfil: "logo_noizz.png",
        nombre: "Rock Clásico"
    },
    {
        fotoPerfil: "logo_noizz.png",
        nombre: "Pop Hits"
    },
    {
        fotoPerfil: "logo_noizz.png",
        nombre: "Indie Vibes"
    },
    {
      fotoPerfil: "logo_noizz.png",
      nombre: "Rock Clásico"
    },
    {
        fotoPerfil: "logo_noizz.png",
        nombre: "Pop Hits"
    },
    {
        fotoPerfil: "logo_noizz.png",
        nombre: "Indie Vibes"
    },
    {
      fotoPerfil: "logo_noizz.png",
      nombre: "Rock Clásico"
    },
    {
        fotoPerfil: "logo_noizz.png",
        nombre: "Pop Hits"
    },
    {
        fotoPerfil: "logo_noizz.png",
        nombre: "Indie Vibes"
    }
  ];

  ngOnInit(): void {
    this.foto = this.tokenService.getUser().fotoPerfil;
    this.mostrarBarra =  false;

    const nombreUsuario = this.route.snapshot.paramMap.get('nombreUsuario'); 
    if (nombreUsuario) {
      this.currentUser = nombreUsuario;
      console.log('nombre:', this.currentUser)
    }
    
    const topDiv = this.el.nativeElement.querySelector('.top-div');
  
    if (topDiv) {
      const observer = new IntersectionObserver(
        (entries) => {
          this.mostrarBarra = !entries[0].isIntersecting;
          console.log('mostrar:', this.mostrarBarra);
        },
        { threshold: 0 }
      );
      observer.observe(topDiv);
    }

    this.authService.pedirDatosOtroOyente(this.currentUser)
    .subscribe({
      next: (response) => {   
        console.log('perfil:', response);
        this.oyente.nombre = response.oyente.nombreUsuario;
        this.oyente.foto = response.oyente.fotoPerfil;
        this.oyente.nSeguidores = response.oyente.numSeguidores;
        this.oyente.nSeguidos = response.oyente.numSeguidos;
        //this.oyente.listasPublicas = response.oyente.listasPublicas;
        this.oyente.siguiendo = response.oyente.siguiendo;
        if(response.ultimoNoizzy != null) {
          this.ultimoNoizzy.id = response.ultimoNoizzy.id;
          this.ultimoNoizzy.fecha = response.ultimoNoizzy.fecha;
          this.ultimoNoizzy.like = response.ultimoNoizzy.like;
          this.ultimoNoizzy.texto = response.ultimoNoizzy.texto;
        }
      },
      error: (error) => {
        console.error("Error al guardar los nuevos datos:", error);
      },
      complete: () => {
        console.log("Datos guardados con éxito");
      }
    });
  }

  toggleSeguir() {
    this.oyente.siguiendo = !this.oyente.siguiendo;
    //MANDAR AL BACKEND
  }

  toggleLike() {
    this.ultimoNoizzy.like = !this.ultimoNoizzy.like;
    //MANDAR AL BACKEND
  }
  
  
}
