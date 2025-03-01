import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; 

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAllUsers().subscribe({
      next: (response) => {
        this.usuarios = response.usuarios;
        console.log(this.usuarios);
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }
}


