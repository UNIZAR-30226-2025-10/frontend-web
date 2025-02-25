import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { ResultadosComponent } from './components/resultados/resultados.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BuscadorComponent, MusicPlayerComponent, ResultadosComponent, RouterModule],
  template: `
    <app-buscador 
      *ngIf="!isAuthPage" 
      (searchResults)="updateResults($event)">
    </app-buscador>

    <app-resultados 
      *ngIf="hasResults() && !isAlbumPage"
      [artists]="artists"
      [tracks]="tracks"
      [albums]="albums"
      [playlists]="playlists">
    </app-resultados>

    <router-outlet></router-outlet>

    <app-music-player *ngIf="!isAuthPage"></app-music-player>
  `
})
export class AppComponent {
  artists: any[] = [];
  tracks: any[] = [];
  albums: any[] = [];
  playlists: any[] = [];
  isAlbumPage: boolean = false;
  isAuthPage: boolean = false;  // Variable para ocultar menú en login y registro

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAlbumPage = this.router.url.startsWith('/album') || this.router.url === '/login' || this.router.url === '/opcionesRegistro' || this.router.url === '/registroOyente' || this.router.url === '/registroArtista' || this.router.url === '/olvidoContrasena1' || this.router.url === '/olvidoContrasena2' || this.router.url === '/olvidoContrasena3';

        // Detectamos si estamos en /login o /register
        this.isAuthPage = this.router.url === '/login' || this.router.url === '/opcionesRegistro' || this.router.url === '/registroOyente' || this.router.url === '/registroArtista' || this.router.url === '/olvidoContrasena1' || this.router.url === '/olvidoContrasena2' || this.router.url === '/olvidoContrasena3';
      }
    });
  }

  hasResults(): boolean {
    return this.artists.length > 0 || this.tracks.length > 0 || this.albums.length > 0 || this.playlists.length > 0;
  }
  
  updateResults(data: any) {
    this.artists = data.artists || [];
    this.tracks = data.tracks || [];
    this.albums = data.albums || [];
    this.playlists = data.playlists || [];
  
    if (this.hasResults() && this.router.url !== '/home') {
      this.router.navigate(['/home']); // Redirige solo si no estás en /home
    }
  }
  ngAfterViewInit() {
    this.adjustBodyPadding();
    window.addEventListener('resize', this.adjustBodyPadding);
  }

  adjustBodyPadding() {
    const musicPlayer = document.querySelector('.music-player') as HTMLElement;
    const buscador = document.querySelector('.menu') as HTMLElement;
    let paddingBottom = 0;
    let paddingTop = 0;

    if (musicPlayer) {
      paddingBottom = musicPlayer.offsetHeight;
    }

    if (buscador) {
      paddingTop = buscador.offsetHeight;
    }

    document.body.style.paddingBottom = `${paddingBottom}px`;
    document.body.style.paddingTop = `${paddingTop}px`;
  } 
  
}
