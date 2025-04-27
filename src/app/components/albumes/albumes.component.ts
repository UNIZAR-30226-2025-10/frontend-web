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
  selector: 'app-albumes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './albumes.component.html',
  styleUrl: './albumes.component.css'
})
export class AlbumesComponent {

  albumes: any[] = [];
  artista: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService,private tokenService: TokenService,private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    const nombreUsuario = this.route.snapshot.paramMap.get('nombreUsuario'); 
    if (nombreUsuario) {
      this.artista = nombreUsuario;
    }
    this.pedirAlbumes();
  }

  pedirAlbumes(): void {
    this.authService.pedirAlbumesOtroArtista(this.artista)
      .subscribe({
        next: (response) => {
          this.albumes = response.albumes;
        },
        error: (error) => {
          console.error("Error al obtener los albumes del artista:", error);
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
