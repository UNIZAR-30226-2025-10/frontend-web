import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TokenService } from './token.service';
import { Router, RouterModule } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token de autorización');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/logout`, null, { headers: headers });
  }

  registerOyente(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-oyente`, credentials);
  }

  registerArtista(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-artista`, credentials);
  }

  eliminarCuenta(credentials: any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token de autorización');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/delete-account`, credentials, { headers: headers });
  }

  enviarCorreo(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, credentials);
  }

  enviarCodigo(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-codigo`, credentials);
  }

  enviarNuevaContrasenya(credentials: any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token temporal');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/reset-password`, credentials, { headers: headers });
  }
<<<<<<< Updated upstream
=======

  pedirSolicitudes(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-pendientes`,  { headers: headers } );
  }

  validarSolicitudes(credentials: any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/check-artista`, credentials, { headers: headers } );
  }

  enviarCodigoArtista(credentials: any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/verify-artista`, credentials, { headers: headers } );
  }

  //PARA REPRODUCIR UNA CANCION SOLA (QUE NO ESTA EN ALBUM O PLAYLIST)
  pedirCancionSola(id: string): Observable<any> {
    const token = this.tokenService.getToken();
    const sid = this.tokenService.getSid();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }

    if (!sid) {
      console.error('No se encontró el SID');
      return of({ error: 'Falta SID.' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'sid': sid
    });
  
    // Aquí enviamos el 'id' en el cuerpo de la solicitud, no en la URL
    const body = { id: id };
  
    return this.http.put(`${this.apiUrl}/put-cancion-sola`, body, { headers: headers });
  }

  pedirCancionColeccion(id: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Aquí enviamos el 'id' en el cuerpo de la solicitud, no en la URL
    const body = { id: id };
  
    return this.http.put(`${this.apiUrl}/put-cancion-coleccion`, body, { headers: headers });
  }
  
  

  datosAlbum (id: string): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-datos-album?id=${id}`, { headers: headers });

  }

  pedirMisDatosOyente(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-mis-datos-oyente`, { headers: headers } );
  }

  pedirTopArtistas(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-historial-artistas`, { headers: headers } );
  }

  pedirColeccionesRecientes(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-historial-colecciones`, { headers: headers } );
  }

  pedirHistorialCanciones(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-historial-canciones`, { headers: headers } );
  }

  pedirMisPlaylists(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-mis-playlists`, { headers: headers } );
  }

  pedirRecomendaciones(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-recomendaciones`, { headers: headers } );
  }

  pedirMisSeguidos(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-seguidos`, { headers: headers } );
  }

  pedirMisSeguidores(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-seguidores`, { headers: headers } );
  }

  buscador(query:string): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/search?termino=${query}`, { headers: headers });
  }

  buscadorPlaylist(query:string,playlistId:any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/search-for-playlist?termino=${query}&playlist=${playlistId}`, { headers: headers });
  }

  pedirCancionActual(): Observable<any>{
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/get-cancion-actual`, { headers: headers } );
  }

  guardarProgreso(progreso: any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('progreso', progreso);
    
    const body = { progreso: progreso};
    

    return this.http.patch(`${this.apiUrl}/change-progreso`, body, { headers: headers } );
  }

  favoritos(id:string, fav: boolean): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body = { id: id, fav: fav};
  
    return this.http.put(`${this.apiUrl}/change-fav`, body, { headers: headers });
  }

  addToPlaylist(idCancion: string, idPlaylist: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body = { cancion: idCancion, playlist: idPlaylist};
  
    return this.http.post(`${this.apiUrl}/add-to-playlist`, body, { headers: headers });
  }

  deleteFromPlaylist(idCancion: string, idPlaylist: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body = { cancion: idCancion, playlist: idPlaylist};
  
    return this.http.delete(`${this.apiUrl}/delete-from-playlist`,  { body, headers });  
  }


  pedirMisDatosArtista(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-mis-datos-artista`, { headers: headers } );
  }

  pedirMisAlbumesArtista(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-mis-albumes`, { headers: headers } );
  }

  crearPlaylist(foto: File | string,nombre:string): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { foto: foto, nombre: nombre};

    return this.http.post(`${this.apiUrl}/create-playlist`, body,{ headers: headers } );
  }

  pedirDatosPlaylist(id: string): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-datos-playlist?id=${id}`, { headers: headers } );
  }

  invitarUsuario(seguidorId:string,playlistId:string): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token de autorización');
      return of({ error: 'No autorizado' });
    }

    console.log('token', token);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { nombreUsuario: seguidorId, playlist: playlistId};
  
    return this.http.post(`${this.apiUrl}/invite-to-playlist`, body, { headers: headers });
  }

  pedirInvitaciones(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-invitaciones`, { headers: headers } );
  }

  aceptarInvitacion(playlistId:string): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token de autorización');
      return of({ error: 'No autorizado' });
    }

    console.log('token', token);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { id: playlistId};
  
    return this.http.post(`${this.apiUrl}/accept-invitacion`, body, { headers: headers });
  }

  rechazarInvitacion(playlistId:string): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token de autorización');
      return of({ error: 'No autorizado' });
    }

    console.log('token', token);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { id: playlistId};
  
    return this.http.delete(`${this.apiUrl}/delete-invitacion`,{body, headers });
  }

  pedirMiNombre(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-mi-nombre`, { headers: headers } );
  }
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======

  eliminarCancion(id: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.apiUrl}/delete-cancion?id=${id}`, {headers: headers});
  }

  eliminarAlbum(id: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.apiUrl}/delete-album?id=${id}`, {headers: headers});
  }

  abandonarPlaylist(id: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { playlist: id};

    return this.http.delete(`${this.apiUrl}/leave-playlist`, {body,headers});
  }
  
  cambiarDatosAlbum(id: string, nombre: any, fotoPortada: any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    const body = { nombre: nombre, fotoPortada: fotoPortada };
  
    return this.http.patch(`${this.apiUrl}/change-album?id=${id}`, body, { headers: headers });
  }
  
  pedirMeGustasCancion(id: any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-estadisticas-favs?id=${id}`, { headers: headers });
  }

  pedirPlaylistsContienenCancion(id: any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-estadisticas-playlists?id=${id}`, { headers: headers });
  }

  incrementarReproduccionesCancion(): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    // Asegúrate de enviar un objeto vacío `{}` como primer argumento
    return this.http.put(`${this.apiUrl}/add-reproduccion`, {}, { headers });
  }

  buscarInvitados(termino: string, playlistId: number | null): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
     return this.http.get(`${this.apiUrl}/search-invitados?termino=${termino}&playlist=${playlistId}`, { headers });
  }
>>>>>>> Stashed changes
}
