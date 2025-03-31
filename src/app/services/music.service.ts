import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private currentSong: string | null = null;
  private currentPlaylist: string | null = null;
  private historyStack: string[] = [];
  private forwardStack: string[] = [];

  playSong(song: string, playlist: string) {
    if (playlist !== this.currentPlaylist) {
      // Si cambiamos de playlist, reseteamos historial
      this.historyStack = [];
      this.forwardStack = [];
      this.currentPlaylist = playlist;
    } else if (this.currentSong) {
      // Guardamos la actual en el historial si seguimos en la misma playlist
      this.historyStack.push(this.currentSong);
    }

    this.currentSong = song;
  }

  playPrevious() {
    if (this.historyStack.length === 0) return;
    
    this.forwardStack.unshift(this.currentSong as string); // Guardar en "adelante"
    this.currentSong = this.historyStack.pop() as string;
  }

  playNext() {
    if (this.forwardStack.length === 0) return;

    this.historyStack.push(this.currentSong as string); // Guardar en "atrás"
    this.currentSong = this.forwardStack.shift() as string;
  }

  getCurrentSong() {
    return this.currentSong;
  }

  getCurrentPlaylist() {
    return this.currentPlaylist;
  }

  canGoBack() {
    return this.historyStack.length > 0;
  }

  canGoForward() {
    return this.forwardStack.length > 0;
  }
}
