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

  constructor(private authService:AuthService, private tokenService : TokenService, private router: Router) {}

  ngOnInit(): void {
      if(!this.tokenService.isAuthenticatedAndOyente() && !this.tokenService.isAuthenticatedAndArtista()) {
        this.router.navigate(['/login']);
      }
  }

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


