import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  public credenciales = {
    clientId: 'c6fffd38c7014fef9865b162d1f61366',
    clientSecret: '6effa3323f884c5897f601d4321f5296',
    accessToken: 'BQDtAsM9Dhkz9PJvOYFOO7-lF84bXkduJ8KCDHv594QNP6AUBCjvZ4VYsufjkUqqfixQ2WYnc13L9Yb1UMXjjRGBk4KEJCmnld4WbnCVurv9Cnm9E2wZTbxhctt_Sb10YbiNFuNvvEY',
    tokenExpiration: 0, // Puedes omitir la expiración si solo usas este token de forma estática
  };

  public poolURIS = {
    authorize: 'https://accounts.spotify.com/authorize?client_id=' +
      this.credenciales.clientId +
      '&response_type=token' +
      '&redirect_uri=' + encodeURIComponent('http://localhost:4200/callback') +
      '&scope=streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state' +
      '&expires_in=3600', // Define que el token expirará en una hora
    refreshAccessToken: 'https://accounts.spotify.com/api/token'
  };

  constructor(private http: HttpClient) {
    // Ya no es necesario realizar una verificación de token, ya que usaremos el token predefinido.
  }

  // Método para obtener el token de acceso (siempre el mismo token)
  getToken(): string {
    return this.credenciales.accessToken;
  }

  // Realiza la llamada a la API de Spotify con el token de acceso
  getQuery(query: string) {
    const url = `https://api.spotify.com/v1/${query}`;
    const header = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.credenciales.accessToken }) };
    return this.http.get(url, header);
  }

  // Obtener nuevas publicaciones
  getNewReleases() {
    return this.getQuery('browse/new-releases').pipe(map((data: any) => data.albums.items));
  }

  // Obtener listas de reproducción destacadas
  getFeaturedPlaylists() {
    return this.getQuery('browse/featured-playlists').pipe(map((data: any) => data.playlists.items));
  }

  // Buscar artistas
  getArtists(search: string) {
    return this.getQuery(`search?q=${search}&type=artist&limit=14`).pipe(map((data: any) => data.artists.items));
  }

  // Obtener detalles de una lista de reproducción
  getPlaylist(id: string) {
    return this.getQuery(`playlists/${id}`).pipe(map((data: any) => data));
  }

  // Obtener detalles de un artista
  getArtist(id: string) {
    return this.getQuery(`artists/${id}`).pipe(map((data: any) => data));
  }

  // Obtener las mejores canciones de un artista
  getTopTracks(id: string) {
    return this.getQuery(`artists/${id}/top-tracks?country=us`).pipe(map((data: any) => data.tracks));
  }

  getAll(query: string) {
    return this.getQuery(`search?q=${query}&type=artist,track,playlist,album&limit=30`).pipe(
      map((data: any) => ({
        artists: data.artists.items,
        tracks: data.tracks.items,
        playlists: data.playlists.items,
        albums: data.albums.items
      }))
    );
  }

  getAlbum(id: string) {  
    return this.getQuery(`albums/${id}`);
  }


  // Método para manejar el callback con el token (lo puedes dejar sin usar ya que no lo necesitas en este caso)
  handleAuthCallback() {
    // Ya no es necesario porque estamos usando el token manualmente.
    console.error('Error: Callback no necesario con token predefinido');
  }
}
