import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-olvido-contrasena3',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './olvido-contrasena3.component.html',
  styleUrl: './olvido-contrasena3.component.css'
})
export class OlvidoContrasena3Component implements OnInit{
  
  credentials = {correo:'', nueva_contrasenya:''};

  isPasswordVisible: boolean = false;
  isLetterValid: boolean = false;
  isNumberValid: boolean = false;
  isLengthValid: boolean = false;
  isFormValid: boolean = false;

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private tokenService: TokenService) {
    const navigation = this.router.getCurrentNavigation();
    const correo = (navigation?.extras.state as { correo: string })?.correo;


    if (correo) {
      this.credentials.correo = correo;  // Asigna el correo a la propiedad credentials
    }
  }

  ngOnInit(): void {
      if(!this.tokenService.hasTempToken()) {
        this.router.navigate(['/login']);
      }
  }
  

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  validatePassword(): void {
    const value = this.credentials.nueva_contrasenya;
  
    this.isLetterValid = /[A-Za-z]/.test(value);
    this.isNumberValid = /[0-9#?!&]/.test(value);
    this.isLengthValid = value.length >= 10;

    this.isFormValid = this.isLetterValid && this.isNumberValid && this.isLengthValid;
  }

  onPasswordChange(): void {
    this.validatePassword();
  }


  onSubmit(): void {

    this.authService.enviarNuevaContrasenya(this.credentials)
    .subscribe({
      next: (response) => {
        this.tokenService.clearTemporalToken();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al autenticar:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }
}
