import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-callback',
  template: `
    <div>Redirigiendo...</div> 
  `,
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    // Llama al método que maneja la autenticación del callback de Spotify
    this.spotifyService.handleAuthCallback();
  }
}
