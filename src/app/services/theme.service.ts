import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router, private notificationService: NotificationService) {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      document.body.classList.add(savedTheme);
    }
  }

  toggleTheme(claro:boolean): void {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark-theme' : '');
    this.authService.cambiarTema(claro)
      .subscribe({
        next: (response) => {
          console.log("Tema cambiado con éxito:", response);
        },
        error: (error) => {
          console.error("Error al obtener el tema:", error);
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
          console.log("Tema recuperado con éxito");
        }
      });
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-theme');
  }

  setThemeFromUserPreference(isClaro: boolean): void {
  if (isClaro) {
    document.body.classList.remove('dark-theme');
    localStorage.setItem(this.THEME_KEY, '');
  } else {
    document.body.classList.add('dark-theme');
    localStorage.setItem(this.THEME_KEY, 'dark-theme');
  }
}

}
