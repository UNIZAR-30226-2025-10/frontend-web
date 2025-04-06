import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificacionesService } from '../../services/notificaciones.service';



@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent {

  misInvitaciones: any[] = [];

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router,private route: ActivatedRoute,private notificacionesService:NotificacionesService){}

  ngOnInit(): void {
    this.pedirInvitaciones();

    this.notificacionesService.nuevaInvitacion$.subscribe(nuevaInvitacion => {
      this.misInvitaciones.unshift(nuevaInvitacion);
    });
  }

  pedirInvitaciones(): void {
    this.authService.pedirInvitaciones()
      .subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);   
          this.misInvitaciones = response.invitaciones || [];
          console.log('misInvitaciones actualizado:', this.misInvitaciones);
        },
        error: (error) => {
          console.error("Error al obtener las invitaciones:", error);
        },
        complete: () => {
          console.log("Invitaciones recuperadas con éxito");
        }
      });
  }

  aceptarInvitacion(playlistId: string): void {
    this.authService.aceptarInvitacion(playlistId)
    .subscribe({
      next: (response) => {   
        this.misInvitaciones = this.misInvitaciones.filter(invitacion => invitacion.id !== playlistId);
      },
      error: (error) => {
        console.error("Error al aceptar la invitación", error);
      },
      complete: () => {
        console.log("Invitación aceptada con éxito");
      }
    });
  }

  rechazarInvitacion(playlistId: string): void {
    this.authService.rechazarInvitacion(playlistId)
    .subscribe({
      next: (response) => {   
        this.misInvitaciones = this.misInvitaciones.filter(invitacion => invitacion.id !== playlistId);
      },
      error: (error) => {
        console.error("Error al rechazar la invitación", error);
      },
      complete: () => {
        console.log("Invitación rechazada con éxito");
      }
    });
  }

}
