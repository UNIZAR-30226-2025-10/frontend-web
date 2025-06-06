import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router'; 
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  solicitudes: any[] = [];
  credentials= { correo:'', valido:false}

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router, private notificationService: NotificationService) {}

  ngOnInit() {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes() {
    this.authService.pedirSolicitudes().subscribe({
      next: (response) => {
        this.solicitudes = response.pendientes;
      },
      error: (error) => {
        console.log('Error en la solicitud', error);
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
        console.log('Petición completada');
      }
    });
  }



  aceptarSolicitud(correo:string):void{
    this.solicitudes = this.solicitudes.filter(solicitud => solicitud.correo !== correo);
    this.credentials.valido=true;
    this.credentials.correo=correo;
    this.authService.validarSolicitudes(this.credentials).subscribe({
      next: (response) => {
        //IR A METER CODIGO
      },
      error: (error) => {
        console.log('Error al aceptar la solicitud', error);
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
        console.log('Petición completada');
      }
    });
  }
  rechazarSolicitud(correo:string):void{
    this.solicitudes = this.solicitudes.filter(solicitud => solicitud.correo !== correo);
    this.credentials.valido=false;
    this.credentials.correo=correo;
    this.authService.validarSolicitudes(this.credentials).subscribe({
      next: (response) => {
        //IR A METER CODIGO
      },
      error: (error) => {
        console.log('Error al aceptar la solicitud', error);
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
        console.log('Petición completada');
      }
    });
  }
  cerrarSesion(): void {
    this.authService.logout()
    .subscribe({
      next: () => {
        this.tokenService.clearStorage();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar la sesión:', error);
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
        console.log('Petición completada');
      }
    });
  }
}
