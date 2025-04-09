import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

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

  mostrarBarra: boolean = false;
  currentUser: string =  '';
  oyente: datosOyente = { nombre: '', foto:'', nSeguidores: 0, nSeguidos: 0, listasPublicas:0, siguiendo: false};
  ultimoNoizzy: Noizzy = { texto: '', id: 0, fecha: '', like: false};
  susSeguidos: any[] = [];
  susSeguidores: any[] = [];
  susPlaylistsPublicas: any[] = [];
  suNumeroPlaylistsPublicas: number = 0;


  @ViewChild('barraSuperior', { static: false }) topBar!: ElementRef<HTMLElement>;

  constructor(private el: ElementRef, private authService: AuthService, private tokenService: TokenService, private router: Router,  private route: ActivatedRoute, private notificationService: NotificationService){}

  ngOnInit(): void {
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

    this.authService.pedirDatosOtroOyente(this.currentUser).pipe(
      tap((response) => {
        console.log('perfil:', response);
        this.oyente.nombre = response.oyente.nombreUsuario;
        this.oyente.foto = response.oyente.fotoPerfil;
        this.oyente.nSeguidores = response.oyente.numSeguidores;
        this.oyente.nSeguidos = response.oyente.numSeguidos;
        this.oyente.siguiendo = response.oyente.siguiendo;
        
        if (response.ultimoNoizzy != null) {
          this.ultimoNoizzy.id = response.ultimoNoizzy.id;
          this.ultimoNoizzy.fecha = response.ultimoNoizzy.fecha;
          this.ultimoNoizzy.like = response.ultimoNoizzy.like;
          this.ultimoNoizzy.texto = response.ultimoNoizzy.texto;
        }
      }),
      switchMap(() => forkJoin({
        susSeguidos: this.authService.pedirSeguidosOtro(this.oyente.nombre),
        susSeguidores: this.authService.pedirSeguidoresOtro(this.oyente.nombre),
        susPlaylistsPublicas: this.authService.pedirPlaylistsPublicasOtro(this.oyente.nombre)
      }))
    ).subscribe({
      next: (response) => {   
        this.susSeguidos = response.susSeguidos.seguidos;
        this.susSeguidores = response.susSeguidores.seguidores;
        this.susPlaylistsPublicas = response.susPlaylistsPublicas.playlists;
        this.suNumeroPlaylistsPublicas = response.susPlaylistsPublicas.n_playlists;
      },
      error: (error) => {
        console.error('Error en alguna de las peticiones:', error);
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      },
      complete: () => {
        console.log('Todas las peticiones completadas');
      }
    });
    
  }

  toggleSeguir() {
    this.authService.changeFollow(this.oyente.nombre, !this.oyente.siguiendo)
    .subscribe({
      next: () => {   
        this.oyente.siguiendo = !this.oyente.siguiendo;
      },
      error: (error) => {
        console.error('Error al seguir o dejar de seguir', error);
        // No esta logeado
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        }
      },
      complete: () => {
        console.log('Cambio completado con éxito');
      }
    });
  }

  toggleLike() {
   
    this.ultimoNoizzy.like = !this.ultimoNoizzy.like;
    //MANDAR AL BACKEND
  }
  
  
}
