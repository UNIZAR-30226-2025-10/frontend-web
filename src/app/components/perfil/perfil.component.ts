import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, NgZone} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap, tap } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

interface datosOyente {
  nombre: string;
  foto: string;
  nSeguidores: number;
  nSeguidos: number;
  listasPublicas: number;
  siguiendo: boolean;
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
  ultimoNoizzy: any;
  susSeguidos: any[] = [];
  susSeguidores: any[] = [];
  susPlaylistsPublicas: any[] = [];
  suNumeroPlaylistsPublicas: number = 0;


  @ViewChild('barraSuperior', { static: false }) topBar!: ElementRef<HTMLElement>;

  constructor( private ngZone: NgZone, private el: ElementRef, private authService: AuthService, private tokenService: TokenService, private router: Router,  private route: ActivatedRoute, private notificationService: NotificationService){}

  ngOnInit(): void {
    this.mostrarBarra = false;
  
    const topDiv = this.el.nativeElement.querySelector('.top-div');
    if (topDiv) {
      const observer = new IntersectionObserver(
        (entries) => {
          this.mostrarBarra = !entries[0].isIntersecting;
        },
        { threshold: 0 }
      );
      observer.observe(topDiv);
    }
  
    this.route.paramMap.pipe(
      switchMap(params => {
        const nombreUsuario = params.get('nombreUsuario');
        if (nombreUsuario) {
          this.currentUser = nombreUsuario;
          console.log('Nuevo usuario cargado:', this.currentUser);

          window.scrollTo({ top: 0, behavior: 'smooth' });
  
          return this.authService.pedirDatosOtroOyente(this.currentUser).pipe(
            tap((response) => {
              this.oyente.nombre = response.oyente.nombreUsuario;
              this.oyente.foto = response.oyente.fotoPerfil;
              this.oyente.nSeguidores = response.oyente.numSeguidores;
              this.oyente.nSeguidos = response.oyente.numSeguidos;
              this.oyente.siguiendo = response.oyente.siguiendo;
    
              if (response.ultimoNoizzy != null) {
                console.log(response)
                this.ultimoNoizzy = response.ultimoNoizzy;
              } else {
                // Reiniciar ultimoNoizzy si no tiene
                this.ultimoNoizzy = { texto: '', id: 0, fecha: '', like: false };
              }
            }),
            switchMap(() => forkJoin({
              susSeguidos: this.authService.pedirSeguidosOtroLimitado(this.oyente.nombre,15),
              susSeguidores: this.authService.pedirSeguidoresOtroLimitado(this.oyente.nombre,15),
              susPlaylistsPublicas: this.authService.pedirPlaylistsPublicasOtroLimitado(this.oyente.nombre,15)
            }))
          );
        } else {
          return [];
        }
      })
    ).subscribe({
      next: (response: any) => {
        this.susSeguidos = response.susSeguidos.seguidos;
        this.susSeguidores = response.susSeguidores.seguidores;
        this.susPlaylistsPublicas = response.susPlaylistsPublicas.playlists;
        this.suNumeroPlaylistsPublicas = response.susPlaylistsPublicas.n_playlists;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        if (error.status === 401) {
          this.tokenService.clearStorage();
          this.notificationService.showSuccess('Sesión iniciada en otro dispositivo');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      },
      complete: () => {
        console.log('Perfil cargado.');
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

  navigateToProfile(username: string) {
    this.router.navigate(['/home/perfil', username]).then(() => {
      this.resetScroll();
    });
  }

private resetScroll() {
  this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
      const todoElement = document.querySelector('.todo');
      if (todoElement) {
        todoElement.scrollTop = 0;
        console.log('Scroll reset en .todo');
      }
      
      let currentElement = this.el.nativeElement;
      while (currentElement && currentElement !== document.body) {
        const style = getComputedStyle(currentElement);
        if (style.overflow === 'auto' || style.overflow === 'scroll' || 
            style.overflowY === 'auto' || style.overflowY === 'scroll') {
          currentElement.scrollTop = 0;
          console.log('Scroll reset en elemento con overflow:', currentElement);
        }
        currentElement = currentElement.parentElement;
      }
      
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      console.log('Intento de reset de scroll completado');
    }, 10); 
    
    setTimeout(() => {
      const todoElement = document.querySelector('.todo');
      if (todoElement) todoElement.scrollTop = 0;
    }, 100);
    
    setTimeout(() => {
      const todoElement = document.querySelector('.todo');
      if (todoElement) todoElement.scrollTop = 0;
    }, 500);
  });
}

  
  
}
