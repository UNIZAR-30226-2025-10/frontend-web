import {Component, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeEs);

@Component ({
selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' } 
  ]

})
export class AppComponent implements OnInit {
  title = 'Noizz';

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    const token = this.tokenService.getToken();
    console.log('token en app:', token);
  
    setTimeout(() => {
      if (token && this.router.url === '/login') {  
        this.router.navigate(['/home/home']);
      }
    }, 0); 
  }
}