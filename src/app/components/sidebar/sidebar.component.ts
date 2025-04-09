import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('userIconsContainer') userIconsContainer!: ElementRef;

  constructor(private authService: AuthService,private router: Router, private tokenService: TokenService){}

  foto: string ='';

  seguidos: any[] = [];

  ngOnInit(): void {

    this.foto = this.tokenService.getUser().fotoPerfil;
    this.pedirSeguidos()
  
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
      },
      complete: () => {
        console.log("Seguidos recuperados con éxito");
      }
    });
  }

  navigateToMisNoizzys() {
    this.router.navigate(['/home/mis-noizzys']);
  }

  navigateToSusNoizzys() {
    this.router.navigate(['/home/noizzys']);
  }
  
}
