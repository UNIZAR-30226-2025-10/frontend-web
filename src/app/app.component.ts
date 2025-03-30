import {Component, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';

@Component ({
selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'


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



