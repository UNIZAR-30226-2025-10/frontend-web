import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-canciones',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './canciones.component.html',
  styleUrl: './canciones.component.css'
})
export class CancionesComponent {

  canciones: any[] = [];
  artista: string = '';

  constructor(private route: ActivatedRoute, private playerService: PlayerService, private authService: AuthService,private tokenService: TokenService,private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    const nombreUsuario = this.route.snapshot.paramMap.get('nombreUsuario'); 
    if (nombreUsuario) {
      this.artista = nombreUsuario;
    }
    this.pedirCanciones();
  }

  pedirCanciones(): void {
    this.authService.pedirCancionesOtroArtista(this.artista)
      .subscribe({
        next: (response) => {
          this.canciones = response.canciones;
        },
        error: (error) => {
          console.error("Error al obtener las canciones del artista:", error);
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
        }
      });
  }

  onTrackClick(track: any) {
    this.playerService.setTrack(track);
  }

}
