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
      return of({ error: 'No autorizado' });
    }

    console.log('token', token);
    console.log(credentials);


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { contrasenya: credentials.contrasenya};

    return this.http.delete(`${this.apiUrl}/delete-account`, { body, headers });
  }

  enviarCorreo(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, credentials);
  }

  enviarCodigo(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-codigo`, credentials);
  }

  enviarNuevaContrasenya(credentials: any): Observable<any> {
    const token = this.tokenService.getTempToken();

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
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }

  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    const body = { id: id };
  
    return this.http.put(`${this.apiUrl}/put-cancion-sola`, body, { headers: headers });
  }

  pedirCancionColeccion(coleccionId: any, modo: string, orden: any[], index: number): Observable<any> {
    const token = this.tokenService.getToken();
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('orden:', orden)
    console.log('index', index)
    console.log ('id', orden[index])

    const body = { coleccion: coleccionId, modo: modo, orden: orden, index: index };
  
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

  pedirTopArtistasLimitado(limite: number): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-historial-artistas?limite=${limite}`, { headers: headers });
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

  pedirHistorialCancionesLimitado(limite:number): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-historial-canciones?limite=${limite}`, { headers: headers } );
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

  pedirMisPlaylistsLimitado(limite:number): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-mis-playlists?limite=${limite}`, { headers: headers } );
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

    return this.http.get(`${this.apiUrl}/get-mis-seguidos`, { headers: headers } );
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

    return this.http.get(`${this.apiUrl}/get-mis-seguidores`, { headers: headers } );
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
      'Content-Type': 'application/json',
    });
    
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
    console.log('id, fav:', id, fav);
  
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

  echarUsuario(nombreUsuario: string, idPlaylist: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body = { nombreUsuario: nombreUsuario, playlist: idPlaylist};
  
    return this.http.delete(`${this.apiUrl}/expel-from-playlist`,  { body, headers });  
  }

  deletePlaylist(idPlaylist: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body = { id: idPlaylist};
  
    return this.http.delete(`${this.apiUrl}/delete-playlist`,  { body, headers });  
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

  pedirMisAlbumesArtistaLimitado(limite:number): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-mis-albumes?limite=${limite}`, { headers: headers } );
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

    const body = { nombre: nombre, fotoPortada: foto,};

    return this.http.post(`${this.apiUrl}/create-playlist`, body,{ headers: headers } );
  }

  cambiarPrivacidadPlaylist(idPlaylist:string,privacidad:boolean): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { id: idPlaylist, privacidad: privacidad,};

    return this.http.patch(`${this.apiUrl}/change-privacidad`, body,{ headers: headers } );
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

  cambiarDatosPlaylist(idPlaylist:any,nombre:string,foto:string): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { id: idPlaylist, nuevaFoto:foto , nuevoNombre: nombre};

    return this.http.put(`${this.apiUrl}/change-playlist`,body, { headers: headers } );
  }

  playPause(reproduciendo: any, progreso: any):Observable<any> {

    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {reproduciendo: reproduciendo, progreso: progreso};

    return this.http.patch(`${this.apiUrl}/play-pause`, body, { headers: headers } );
  }

  cambiarDatosOyente(nombre: any, fotoPerfil: any):Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {nombre: nombre, fotoPerfil: fotoPerfil};

    return this.http.put(`${this.apiUrl}/change-datos-oyente`, body, { headers: headers } );

  }

  cambiarContrasenyaOyente(contrasenya_actual: any, nueva_contrasenya: any):Observable<any>{
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {contrasenya: contrasenya_actual, nueva: nueva_contrasenya};

    return this.http.put(`${this.apiUrl}/change-contrasenya`, body, { headers: headers } );
  }

  actualizarVolumen(volumen: any):Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {volumen: volumen};

    return this.http.patch(`${this.apiUrl}/change-volumen`, body, { headers: headers } );
  }

  cambiarDatosArtista(nombreUsuario: any, nombreArtistico: any, biografia: any, fotoPerfil: any):Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {nombreUsuario: nombreUsuario, nombreArtistico: nombreArtistico, biografia: biografia, fotoPerfil: fotoPerfil};

    return this.http.put(`${this.apiUrl}/change-datos-artista`, body, { headers: headers } );
  }

  pedirDatosOtroOyente(nombreUsuario:any):Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-datos-oyente?nombreUsuario=${nombreUsuario}`, { headers: headers });
  }

  pedirDatosOtroArtista(nombreUsuario:any):Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-datos-artista?nombreUsuario=${nombreUsuario}`, { headers: headers });
  }

  pedirAlbumesOtroArtista(nombreUsuario:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-albumes?nombreUsuario=${nombreUsuario}`, { headers: headers });
  }

  pedirAlbumesOtroArtistaLimitado(nombreUsuario:any,limite:number): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-albumes?nombreUsuario=${nombreUsuario}&limite=${limite}`, { headers: headers });
  }

  pedirCancionesOtroArtista(nombreUsuario:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-canciones?nombreUsuario=${nombreUsuario}`, { headers: headers });
  }

  pedirCancionesOtroArtistaLimitado(nombreUsuario:any, limite:number): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-canciones?nombreUsuario=${nombreUsuario}&limite=${limite}`, { headers: headers });
  }

  pedirCancionesPopularesOtroArtista(nombreUsuario:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-canciones-populares?nombreUsuario=${nombreUsuario}`, { headers: headers });
  }

  pedirNumeroCancionesFavsArtista(nombreUsuario:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-numero-canciones-favoritas?nombreUsuario=${nombreUsuario}`, { headers: headers });
  }

  pedirCancionesFavsArtista(nombreUsuario: any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-canciones-favoritas?nombreUsuario=${nombreUsuario}`, { headers: headers });
  }

  pedirEstadisticasCancion(id:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-estadisticas-cancion?id=${id}`, { headers: headers });
  }

  pedirMisCancionesArtista(): Observable<any> {
      const token = this.tokenService.getToken();
  
      if (!token) {
        console.error('No se encontró el token');
        return of({ error: 'No autorizado' });;
      }
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
  
      return this.http.get(`${this.apiUrl}/get-mis-canciones`, { headers: headers } );
    }

    pedirMisCancionesArtistaLimitado(limite:number): Observable<any> {
      const token = this.tokenService.getToken();
  
      if (!token) {
        console.error('No se encontró el token');
        return of({ error: 'No autorizado' });;
      }
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
  
      return this.http.get(`${this.apiUrl}/get-mis-canciones?limite=${limite}`, { headers: headers } );
    }

    pedirNotificaciones(): Observable<any> {
      const token = this.tokenService.getToken();
  
      if (!token) {
        console.error('No se encontró el token');
        return of({ error: 'No autorizado' });;
      }
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
  
      return this.http.get(`${this.apiUrl}/has-notificaciones`, { headers: headers } );
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

  pedirNovedadesMusicales(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-novedades-musicales`, { headers: headers } );
  }

  quitarNovedadesCancion(id:any): Observable<any> {
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
  
    const body = { cancion: id};

    return this.http.delete(`${this.apiUrl}/delete-notificacion-cancion`,{ body,headers });
  }

  quitarNovedadesAlbum(id:any): Observable<any> {
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

    const body = { album: id};
  
    return this.http.delete(`${this.apiUrl}/delete-notificacion-album`,{ body,headers });
  }

  pedirInteracciones(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-interacciones`, { headers: headers } );
  }

  quitarInteracciones(id:any): Observable<any> {
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

    const body = { noizzy: id};
    console.log("ID que se está enviando a quitarInteracciones:", id);
  
    return this.http.patch(`${this.apiUrl}/read-interacciones`,body,{ headers:headers });
  }

  pedirNuevosSeguidores(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-nuevos-seguidores`, { headers: headers } );
  }

  quitarNuevoSeguidor(nombreUsuario:string): Observable<any> {
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

    const body = { nombreUsuario: nombreUsuario};
  
    return this.http.patch(`${this.apiUrl}/read-nuevo-seguidor`,body,{ headers });
  }

  pedirFirma(folder: any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/get-signature?folder=${folder}`, { headers: headers } );
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

  
  pedirMeGustasCancionLimitado(id: any,limite:number): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-estadisticas-favs?id=${id}&limite=${limite}`, { headers: headers });
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

  pedirPlaylistsContienenCancionLimitado(id: any,limite:number): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-estadisticas-playlists?id=${id}&limite=${limite}`, { headers: headers });
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

  pedirEtiquetas(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-tags`, { headers: headers } );
  }

  crearCancion(nombre: string, album_id: number, duracion: number, audio_url: string, tags: string[], artistasFt: string[], notificar: boolean): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { nombre: nombre, album_id: album_id, duracion: duracion, audio_url: audio_url, tags: tags , artistasFt: artistasFt, notificar};

    return this.http.post(`${this.apiUrl}/create-cancion`, body,{ headers: headers } );
  }

  pedirEstadisticasAlbum(id:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-estadisticas-album?id=${id}`, { headers: headers });
  }

  pedirMeGustasAlbum(id:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-estadisticas-album-favs?id=${id}`, { headers: headers });
  }

  pedirMeGustasAlbumLimitado(id:any,limite:number): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/get-estadisticas-album-favs?id=${id}&limite=${limite}`, { headers: headers });
  }

  pedirSeguidosOtro(nombreUsuario:any): Observable<any> {
    const token = this.tokenService.getToken();
    

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-seguidos?nombreUsuario=${nombreUsuario}`, { headers: headers } );
  }

  pedirSeguidosOtroLimitado(nombreUsuario:any,limite:number): Observable<any> {
    const token = this.tokenService.getToken();
    

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-seguidos?nombreUsuario=${nombreUsuario}&limite=${limite}`, { headers: headers } );
  }

  pedirSeguidoresOtro(nombreUsuario:any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-seguidores?nombreUsuario=${nombreUsuario}`, { headers: headers } );
  }

  
  pedirSeguidoresOtroLimitado(nombreUsuario:any,limite:number): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-seguidores?nombreUsuario=${nombreUsuario}&limite=${limite}`, { headers: headers } );
  }

  pedirPlaylistsPublicasOtro(nombreUsuario:any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-playlists?nombreUsuario=${nombreUsuario}`, { headers: headers } );
  }

  pedirPlaylistsPublicasOtroLimitado(nombreUsuario:any,limite:number): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-playlists?nombreUsuario=${nombreUsuario}&limite=${limite}`, { headers: headers } );
    
  }

  crearAlbum(nombreAlbum: string, foto_url: string, notificar: boolean): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { nombre_album: nombreAlbum, fotoPortada: foto_url, notificar: notificar }
    return this.http.post(`${this.apiUrl}/create-album`, body,{ headers: headers } );
  }
  
  changeFollow(nombreUsuario:any, siguiendo: boolean): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { nombreUsuario: nombreUsuario, siguiendo: siguiendo };

    return this.http.put(`${this.apiUrl}/change-follow`, body, { headers: headers } );
  }

  pedirOtraCancion(id: any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/get-data-cancion?id=${id}`, { headers: headers } );
  }


  cambiarModo(modo: any, orden: any, index: any): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    
    const body = { modo: modo, orden: orden, index: index};
    return this.http.patch(`${this.apiUrl}/change-modo`, body, { headers: headers } );
  }

  cambiarSesion(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/switch-session`, credentials);
  }

  pedirMisNoizzys(): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.get(`${this.apiUrl}/get-mis-noizzys`, { headers });
  }

  pedirSusNoizzys(nombreUsuario:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.get(`${this.apiUrl}/get-noizzys?nombreUsuario=${nombreUsuario}`, { headers: headers } );
  }

  publicarNoizzy(texto: string, id: any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body = { texto: texto, cancion: id }
    return this.http.post(`${this.apiUrl}/post-noizzy`, body, { headers: headers } );
  }

  likearNoizzy(like: any, noizzy: any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { like: like, noizzy: noizzy }
    return this.http.put(`${this.apiUrl}/change-like`, body, { headers: headers } );
  }

  buscadorNoizzy(query: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.get(`${this.apiUrl}/search-for-noizzy?termino=${query}`, { headers });
  }

  pedirDatosNoizzys(id:any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.get(`${this.apiUrl}/get-datos-noizzy?id=${id}`, { headers: headers } );
  }

  publicarNoizzito(texto: string, id: any, idNoizzy: any): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body = { texto: texto, cancion: id, noizzy: idNoizzy}
    return this.http.post(`${this.apiUrl}/post-noizzito`, body, { headers: headers } );
  }


  borrarNoizzy(id: string): Observable<any> {
    const token = this.tokenService.getToken();
  
    if (!token) {
      console.error('No se encontró el token');
      return of({ error: 'No autorizado' });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const body = { id: id }
    return this.http.delete(`${this.apiUrl}/delete-noizzy`, { body, headers } );
  }
}
