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
  selector: 'app-usuarios-likes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuarios-likes.component.html',
  styleUrl: './usuarios-likes.component.css'
})
export class UsuariosLikesComponent {
  usuarios: any[] = [];
  cancion: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService,private tokenService: TokenService,private router: Router,private notificationService: NotificationService){}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); 
    if (id) {
      this.cancion = id;
    }
    this.pedirUsuarios();
  }

  pedirUsuarios(): void {
    this.authService.pedirMeGustasCancion(this.cancion)
      .subscribe({
        next: (response) => {
          this.usuarios = response.oyentes_favs;
        },
        error: (error) => {
          console.error("Error al recibir los perfiles que han dado me gusta a la cancion:", error);
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


