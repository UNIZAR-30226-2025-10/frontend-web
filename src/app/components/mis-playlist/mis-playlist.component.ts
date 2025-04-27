import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-mis-playlist',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-playlist.component.html',
  styleUrl: './mis-playlist.component.css'
})
export class MisPlaylistComponent {

  misPlaylists: any[] = [];

  constructor(private authService: AuthService,private tokenService: TokenService,private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    this.pedirMisPlaylists();
  }

  pedirMisPlaylists(): void {
    this.authService.pedirMisPlaylists()
      .subscribe({
        next: (response) => {
          this.misPlaylists = response.playlists;
        },
        error: (error) => {
          console.error("Error al obtener las playlists:", error);
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

}
