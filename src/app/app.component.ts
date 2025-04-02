import {Component, OnInit, AfterViewInit} from '@angular/core'
import {RouterOutlet, Router, NavigationEnd } from '@angular/router'
import { TokenService } from './services/token.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { filter } from 'rxjs';

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
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Noizz';

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    const token = this.tokenService.getToken();
    console.log('token en app:', token);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  
    setTimeout(() => {
      if (token && this.router.url === '/login') {  
        //this.router.navigate(['/home/home']);
      }
    }, 0); 


  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }
}