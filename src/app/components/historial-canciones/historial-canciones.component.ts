import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { PlayerService } from '../../services/player.service';


@Component({
  selector: 'app-historial-canciones',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './historial-canciones.component.html',
  styleUrl: './historial-canciones.component.css'
})
export class HistorialCancionesComponent {

  ultimasCanciones: any[] = [];

  constructor(private authService: AuthService,private tokenService: TokenService,private playerService: PlayerService,private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    this.pedirUltimasCanciones();
  }

  pedirUltimasCanciones(): void {
    this.authService.pedirHistorialCanciones()
      .subscribe({
        next: (response) => {
          this.ultimasCanciones = response.historial_canciones;
        },
        error: (error) => {
          console.error("Error al obtener las ultimas canciones:", error);
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
    // En lugar de emitir el evento, llamamos al servicio para actualizar el track
    this.playerService.setTrack(track);
  }


}
