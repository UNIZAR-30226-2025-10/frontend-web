import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-playlists-con-cancion',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './playlists-con-cancion.component.html',
  styleUrl: './playlists-con-cancion.component.css'
})
export class PlaylistsConCancionComponent {
  Playlists: any[] = [];
  cancion: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService,private tokenService: TokenService,private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); 
    if (id) {
      this.cancion = id;
    }
    this.pedirPlaylists();
  }

  pedirPlaylists(): void {
    this.authService.pedirPlaylistsContienenCancion(this.cancion)
      .subscribe({
        next: (response) => {
          this.Playlists = response.playlists_publicas;
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
