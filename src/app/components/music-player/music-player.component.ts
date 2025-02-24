import { Component, OnInit } from '@angular/core';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from '../../services/spotify.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MusicPlayerComponent implements OnInit {

  currentTrack: any = null;
  isPlaying: boolean = false;
  volume: number = 50;
  player: any;  

  constructor(private spotifyService: SpotifyService, private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.currentTrack$.subscribe(track => {
      if (track) {
        this.playTrack(track);
      }
    });

    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new window.Spotify.Player({
        name: 'Mi reproductor de música',
        getOAuthToken: (cb: any) => { cb(this.spotifyService.getToken()); },  
        volume: 0.8,
      });

      this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
      });

      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device is not ready', device_id);
      });

      this.player.connect().then((success: boolean) => {
        if (success) {
          console.log('The Web Playback SDK is successfully connected to Spotify!');
        }
      }).catch((error: any) => {
        console.error('Error connecting to Spotify player', error);
      });
    };

    this.loadSpotifySDK();
  }

  loadSpotifySDK() {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
  }

  playTrack(track: any) {
    if (this.currentTrack === track) {
      if (this.player) {
        this.player.togglePlay().then(() => {
          console.log(`${track.name} ${this.player.paused ? 'paused' : 'playing'}`);
        }).catch((error: any) => {
          console.error('Error al alternar la canción', error);
        });
      }
    } else {
      this.currentTrack = track;

      if (this.player) {
        this.player._options.getOAuthToken((token: string) => {
          this.player._options.play({
            spotify_uri: track.uri,
            playerInstance: this.player,
            token: token
          }).then(() => {
            console.log('Reproduciendo: ' + track.name);
          }).catch((error: any) => {
            console.error('Error al reproducir el track:', error);
          });
        });
      }
    }
  }

  stopTrack() {
    if (this.player) {
      this.player.pause().then(() => {
        console.log('Reproducción detenida');
      }).catch((error: any) => {
        console.error('Error al detener la canción', error);
      });
    }
    this.currentTrack = null;
  }

  togglePlay() {
    if (this.player) {
      this.player.togglePlay().then(() => {
        this.isPlaying = !this.isPlaying;  // Alternar el estado de la canción
        console.log(this.isPlaying ? 'Reproduciendo' : 'Pausado');
      }).catch((error: any) => {
        console.error('Error al alternar la canción', error);
      });
    }
  }
  

  changeVolume() {
    if (this.player) {
      this.player.setVolume(this.volume / 100);
    }
  }

  prevTrack() {
    if (this.player) {
      this.player.previousTrack();
    }
  }

  nextTrack() {
    if (this.player) {
      this.player.nextTrack();
    }
  }

}
