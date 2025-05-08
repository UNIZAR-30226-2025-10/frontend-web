import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para que funcione ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Importar FormsModule para trabajar con ngModel
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { PlayerService } from '../../services/player.service';
import { ProgressService } from '../../services/progress.service';
import { FavoritosService } from '../../services/favoritos.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  correoOusuario: string = '';
  credentials: { correo?: string; nombreUsuario?: string; contrasenya: string } = { contrasenya: '' };
  isPasswordVisible: boolean = false;

  errorMessage: string = '';
  errorMessageModal: string = ''
  isModalOpen = false;

  @Output() trackClicked = new EventEmitter<any>();

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router, private playerService: PlayerService, private progressService: ProgressService, private favoritosService: FavoritosService, private themeService : ThemeService) {}


  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.correoOusuario.includes('@')) {
      this.credentials = { correo: this.correoOusuario, contrasenya: this.credentials.contrasenya };
    } else {
      this.credentials = { nombreUsuario: this.correoOusuario, contrasenya: this.credentials.contrasenya };
    }
    this.authService.login(this.credentials)
    .subscribe({
      next: (response) => {
        this.tokenService.clearStorage();
        this.tokenService.setToken(response.token);
        this.tokenService.setTipo(response.tipo);
        if (response.usuario) {
          this.tokenService.setUser(response.usuario);
        }

        this.themeService.setThemeFromUserPreference(response.usuario.claro);

        if (response.tipo === "pendiente") {
          this.router.navigate(['/pendiente']);
        } else if (response.tipo === "valido") {
          this.router.navigate(['/introducirCodigo']);
        } else if (response.tipo === "admin") {
          this.router.navigate(['/admin']);
        } else {
          
        this.authService.pedirCancionActual()
          .subscribe({
            next: (response) => {
              if (response != null) {
                this.favoritosService.actualizarFavSource.next({ actualizarFavId: null})
                this.playerService.isPlayingSubject.next(null)
                this.playerService.isShuffleSubject.next(null)
                this.playerService.currentTrackSource.next({ track: null, coleccion: null})
                
                this.tokenService.setColeccionActual(null);
                this.tokenService.setCancionActual(null);
                if (response.cancion != null)  {
                  this.tokenService.setProgresoLocal(response.cancion.progreso);
                  if(response.coleccion != null) {
                    this.tokenService.setCancionActual(response.cancion);
                    this.tokenService.setColeccionActual(response.coleccion);
                  } else {
                    this.tokenService.setCancionActual(response.cancion);
                  }
                } 
              }            
            },
            error: (error) => {
              console.error('Error al pedir cancion actual:', error);
            },
            complete: () => {
              console.log('Petición completada');
              this.router.navigate(['/home/home']);
            }
          })
        }
      },
      error: (error) => {
        console.error('Error al autenticar:', error);
        this.errorMessage = error.error.error;
        
        if(error.status === 403) {
          this.crearVentanaEleccion()
        }
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  
  }

  crearVentanaEleccion() {
    this.isModalOpen = true;
  }

  cerrarVentana() {
    this.isModalOpen = false;
  }

  cambiarSesion() {

    this.authService.cambiarSesion(this.credentials)
    .subscribe({
      next: (response) => {
        this.tokenService.clearStorage();
        this.tokenService.setToken(response.token);
        this.tokenService.setTipo(response.tipo);
        if (response.usuario) {
          this.tokenService.setUser(response.usuario);
        }

        if (response.tipo === "pendiente") {
          this.router.navigate(['/pendiente']);
        } else if (response.tipo === "valido") {
          this.router.navigate(['/introducirCodigo']);
        } else if (response.tipo === "admin") {
          this.router.navigate(['/admin']);
        } else {
          
        this.authService.pedirCancionActual()
          .subscribe({
            next: (response) => {
              if (response != null) {
                this.favoritosService.actualizarFavSource.next({ actualizarFavId: null})
                this.playerService.isPlayingSubject.next(null)
                this.playerService.isShuffleSubject.next(null)
                this.playerService.currentTrackSource.next({ track: null, coleccion: null})
                
                this.tokenService.setColeccionActual(null);
                this.tokenService.setCancionActual(null);
                if (response.cancion != null)  {
                  this.tokenService.setProgresoLocal(response.cancion.progreso);
                  if(response.coleccion != null) {
                    this.tokenService.setCancionActual(response.cancion);
                    this.tokenService.setColeccionActual(response.coleccion);
                  } else {
                    this.tokenService.setCancionActual(response.cancion);
                  }
                } 
              }            
            },
            error: (error) => {
              console.error('Error al pedir cancion actual:', error);
            },
            complete: () => {
              console.log('Petición completada');
              this.router.navigate(['/home/home']);
            }
          })
        }
      },
      error: (error) => {
        console.error('Error al autenticar:', error);
        this.errorMessageModal = error.error.error;
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }
}