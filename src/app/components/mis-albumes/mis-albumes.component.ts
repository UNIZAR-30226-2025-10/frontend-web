import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-mis-albumes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-albumes.component.html',
  styleUrl: './mis-albumes.component.css'
})
export class MisAlbumesComponent {
  misAlbumes: any[] = [];

  constructor(private authService: AuthService,private tokenService: TokenService, private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    this.pedirMisAlbumes();
  }

  pedirMisAlbumes(): void {
    this.authService.pedirMisAlbumesArtista()
      .subscribe({
        next: (response) => {
          this.misAlbumes = response.albumes;
        },
        error: (error) => {
          console.error("Error al obtener los albumes:", error);
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
