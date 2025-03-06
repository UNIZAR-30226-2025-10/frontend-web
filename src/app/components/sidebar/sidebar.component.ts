import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('userIconsContainer') userIconsContainer!: ElementRef;

  users = [
    { name: 'Usuario 1', img: 'https://randomuser.me/api/portraits/men/16.jpg', status: 'status-red' },
    { name: 'Usuario 2', img: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'status-red' },
    { name: 'Usuario 3', img: 'https://randomuser.me/api/portraits/men/3.jpg', status: 'status-red' },
    { name: 'Usuario 4', img: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'status-red' },
    { name: 'Usuario 5', img: 'https://randomuser.me/api/portraits/men/5.jpg', status: 'status-red' },
    { name: 'Usuario 6', img: 'https://randomuser.me/api/portraits/women/92.jpg', status: 'status-red' },
    { name: 'Usuario 7', img: 'https://randomuser.me/api/portraits/men/6.jpg', status: 'status-red' },
    { name: 'Usuario 8', img: 'https://randomuser.me/api/portraits/women/4.jpg', status: 'status-red' },
    { name: 'Usuario 9', img: 'https://randomuser.me/api/portraits/men/8.jpg', status: 'status-red' },
    { name: 'Usuario 10', img: 'https://randomuser.me/api/portraits/men/23.jpg', status: 'status-red' }
  ];

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

  
}
