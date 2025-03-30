import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('audioElement') audioElementRef!: ElementRef<HTMLAudioElement>;
  songUrl: string = '';

<<<<<<< Updated upstream
  constructor(private authService:AuthService, private tokenService : TokenService, private router: Router) {}

  ngOnInit(): void {
      if(!this.tokenService.isAuthenticatedAndOyente() && !this.tokenService.isAuthenticatedAndArtista()) {
        this.router.navigate(['/login']);
=======
  messageReceived: string = '';

  recientes: any[] = [];
  artistas: any[] = [];
  ultimasCanciones: any[] = [];
  misPlaylists: any[] = [];
  recomendados: any[] = [];

  @Output() trackClicked = new EventEmitter<any>();

  constructor(private route: ActivatedRoute,private authService:AuthService, private tokenService : TokenService, private router: Router, private playerService: PlayerService) {}

  ngOnInit(): void {

    forkJoin({
      artistas: this.authService.pedirTopArtistas(),
      recientes: this.authService.pedirColeccionesRecientes(),
      canciones: this.authService.pedirHistorialCanciones(),
      playlists: this.authService.pedirMisPlaylists()
    }).subscribe({
      next: (data) => {
        this.artistas = data.artistas.historial_artistas;
        this.recientes = data.recientes.historial_colecciones;
        this.ultimasCanciones = data.canciones.historial_canciones;
        this.misPlaylists = data.playlists.playlists;
        this.intentarMezclar();
      },
      error: (error) => {
        console.error('Error en alguna de las peticiones principales:', error);
>>>>>>> Stashed changes
      }
  }
<<<<<<< Updated upstream

  playAudio() {
    this.authService.pedirCancion()
    .subscribe({
      next: (response) => {
        if (response && response.audio) {
        this.songUrl = response.audio;
        this.audioElementRef.nativeElement.src = this.songUrl;
        this.audioElementRef.nativeElement.play();
      } else {
        console.error('No se pudo obtener la canción');
      }
=======
  
  cargarRecomendaciones() {
    this.authService.pedirRecomendaciones().subscribe({
      next: (data) => {
        this.recomendados = data.canciones_recomendadas;
>>>>>>> Stashed changes
      },
      error: (error) => {
        console.error('Error al autenticar:', error);


      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }
}


