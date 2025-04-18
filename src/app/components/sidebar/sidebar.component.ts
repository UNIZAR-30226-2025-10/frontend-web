import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { SocketService } from '../../services/socket.service';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('userIconsContainer') userIconsContainer!: ElementRef;

  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService, private notificationService: NotificationService,private socketService: SocketService,private notificacionesService: NotificacionesService ){}

  foto: string ='';

  seguidos: any[] = [];
  usuariosConNotificacion: string[] = [];


  ngOnInit(): void {

    this.foto = this.tokenService.getUser().fotoPerfil;
    this.pedirSeguidos()

    this.socketService.connect();

    this.socketService.listen('new-noizzy-ws').subscribe((data: any) => {
      const userIndex = this.seguidos.findIndex(user => user.nombreUsuario === data.nombreUsuario);

      if (userIndex !== -1) {
        //Si no tiene ya notificacion lo añado
        if (!this.usuariosConNotificacion.includes(data.nombreUsuario)) {
          this.usuariosConNotificacion.push(data.nombreUsuario);
        }
        
        //Si tiene notificacion lo pongo el primero
        const user = this.seguidos[userIndex];
        this.seguidos.splice(userIndex, 1);
        this.seguidos.unshift(user);
      }
      this.notificacionesService.emitirNuevoNoizzy(data);
    });
  
  }

  onScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop; // Obtiene la cantidad de scroll vertical
    const userMeIcon = document.querySelector('.fixed-section'); // Selecciona el div con la clase .user-me_icon
    
    if (userMeIcon) {
        if (scrollTop > 10) {
            userMeIcon.classList.add('scrolled'); // Agrega la clase si el scroll es mayor a 10px
        } else {
            userMeIcon.classList.remove('scrolled'); // Quita la clase si el scroll es menor o igual a 10px
        }
    }
  }

  pedirSeguidos(){
    this.authService.pedirMisSeguidos()
    .subscribe({
      next: (response) => {
        console.log("response",response)
        this.seguidos = response.seguidos;
      },
      error: (error) => {
        console.error("Error al recuperar los seguidos:", error);
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
        console.log("Seguidos recuperados con éxito");
      }
    });
  }

  navigateToMisNoizzys() {
    this.router.navigate(['/home/mis-noizzys']);
  }

  navigateToSusNoizzys(nombreUsuario: string) {
    this.router.navigate(['/home/noizzys',nombreUsuario]);
    this.quitarNotificacion(nombreUsuario);
  }

  quitarNotificacion(nombreUsuario: string) {
    const index = this.usuariosConNotificacion.indexOf(nombreUsuario);
    if (index !== -1) {
      this.usuariosConNotificacion.splice(index, 1);
    }
  }
  
}
