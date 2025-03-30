import { Component } from '@angular/core';
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

  users = [
    { name: 'Usuario 1', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 2', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 3', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 4', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 5', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 6', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 7', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 8', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 9', img: 'nouser.png', status: 'status-red' },
    { name: 'Usuario 10',img: 'nouser.png', status: 'status-red' }
  ];
}
