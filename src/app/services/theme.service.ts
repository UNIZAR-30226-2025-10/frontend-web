import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      document.body.classList.add(savedTheme);
    }
  }

  toggleTheme(): void {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark-theme' : '');
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-theme');
  }
}
