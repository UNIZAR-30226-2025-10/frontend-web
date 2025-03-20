import { Component, OnInit, EventEmitter, Output, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  foto: string ='';
  mostrarBarra: boolean = false;
  @ViewChild('barraSuperior', { static: false }) topBar!: ElementRef<HTMLElement>;

  constructor(private el: ElementRef, private authService: AuthService, private tokenService: TokenService, private router: Router){}

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
  }
  
  
}
