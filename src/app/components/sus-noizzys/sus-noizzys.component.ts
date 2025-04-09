import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';

@Component({
  selector: 'app-sus-noizzys',
  imports: [RouterModule, CommonModule],
  templateUrl: './sus-noizzys.component.html',
  styleUrls: ['./sus-noizzys.component.css']
})
export class SusNoizzysComponent implements OnInit {
  noizzys: any[] = [];
  constructor(private authService: AuthService,  private subirCloudinary: SubirCloudinary,  private route: ActivatedRoute) {}

  ngOnInit(): void {
    const nombreUsuario = this.route.snapshot.paramMap.get('nombreUsuario'); 
    this.cargarSusNoizzys(nombreUsuario);
  }

  cargarSusNoizzys(nombreUsuario:any): void {
    this.authService.pedirSusNoizzys(nombreUsuario).subscribe({
      next: (response) => {
        this.noizzys = response.noizzys;
      },
      error: (err) => {
        console.error('Error al cargar los Noizzys:', err);
      }
    });
  }
}