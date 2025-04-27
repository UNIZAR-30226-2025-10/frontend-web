import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { OpcionesRegistroComponent } from './components/opciones-registro/opciones-registro.component';
import { RegistroOyenteComponent } from './components/registro-oyente/registro-oyente.component';
import { RegistroArtistaComponent } from './components/registro-artista/registro-artista.component';
import { OlvidoContrasena1Component } from './components/olvido-contrasena1/olvido-contrasena1.component';
import { OlvidoContrasena2Component } from './components/olvido-contrasena2/olvido-contrasena2.component';
import { OlvidoContrasena3Component } from './components/olvido-contrasena3/olvido-contrasena3.component';
import { AlbumComponent } from './components/album/album.component';
import { MarcoComponent } from './components/marco/marco.component';
import { HomeComponent } from './components/home/home.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { MiPerfilOyenteComponent } from './components/mi-perfil-oyente/mi-perfil-oyente.component';
import { MiPerfilArtistaComponent } from './components/mi-perfil-artista/mi-perfil-artista.component';
import { IntroducirCodigoComponent } from './components/introducir-codigo/introducir-codigo.component';
import { PendienteComponent } from './components/pendiente/pendiente.component';
import { PedirContrasenyaComponent } from './components/pedir-contrasenya/pedir-contrasenya.component';
import { AdminComponent } from './components/admin/admin.component';
import { SeguidosComponent } from './components/seguidos/seguidos.component';
import { SeguidoresComponent } from './components/seguidores/seguidores.component';
import { ArtistaComponent } from './components/artista/artista.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EstadisticasAlbumComponent } from './components/estadisticas-album/estadisticas-album.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { EstadisticasCancionComponent} from './components/estadisticas-cancion/estadisticas-cancion.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { CancionesFavsComponent } from './components/canciones-favs/canciones-favs.component';
import { SubirCancionComponent } from './components/subir-cancion/subir-cancion.component';
import { SubirAlbumComponent } from './components/subir-album/subir-album.component';
import { MisNoizzysComponent } from './components/mis-noizzys/mis-noizzys.component';
import { SusNoizzysComponent } from './components/sus-noizzys/sus-noizzys.component';
import { NoizzitosComponent } from './components/noizzitos/noizzitos.component';
import { TopArtistasComponent } from './components/top-artistas/top-artistas.component';
import { MisPlaylistComponent } from './components/mis-playlist/mis-playlist.component';
import { HistorialCancionesComponent } from './components/historial-canciones/historial-canciones.component';
import { PlaylistsPublicasComponent } from './components/playlists-publicas/playlists-publicas.component';  
import { MisCancionesComponent } from './components/mis-canciones/mis-canciones.component';
import { MisAlbumesComponent } from './components/mis-albumes/mis-albumes.component';
import { PlaylistsConCancionComponent } from './components/playlists-con-cancion/playlists-con-cancion.component';
import { UsuariosLikesAlbumComponent } from './components/usuarios-likes-album/usuarios-likes-album.component';
import { UsuariosLikesComponent } from './components/usuarios-likes/usuarios-likes.component';
import { CancionesComponent } from './components/canciones/canciones.component';
import { AlbumesComponent } from './components/albumes/albumes.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'opcionesRegistro', component: OpcionesRegistroComponent},
  { path: 'registroOyente', component: RegistroOyenteComponent},
  { path: 'registroArtista', component: RegistroArtistaComponent},
  { path: 'olvidoContrasena1', component: OlvidoContrasena1Component},
  { path: 'olvidoContrasena2', component: OlvidoContrasena2Component},
  { path: 'olvidoContrasena3', component: OlvidoContrasena3Component},
  { path: 'introducirCodigo', component: IntroducirCodigoComponent},
  { path: 'pendiente', component: PendienteComponent, canActivate: [authGuard], data: { roles: ['pendiente'] }},
  { path: 'pedirContrasenya', component: PedirContrasenyaComponent, canActivate: [authGuard], data: { roles: ['pendiente'] }},
  { path: 'admin', component: AdminComponent,  canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'home', component: MarcoComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } ,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'album/:id', component: AlbumComponent},
      { path: 'home', component: HomeComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'resultados', component: ResultadosComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'miPerfilOyente', component: MiPerfilOyenteComponent,  canActivate: [authGuard], data: { roles: 'oyente' }},
      { path: 'miPerfilArtista', component: MiPerfilArtistaComponent,  canActivate: [authGuard], data: { roles: 'artista' }},
      { path: 'artista/:nombreUsuario', component: ArtistaComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'perfil/:nombreUsuario', component: PerfilComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'playlist/:id', component: PlaylistComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'estadisticasCancion/:id', component: EstadisticasCancionComponent,  canActivate: [authGuard], data: { roles: 'artista' }},
      { path: 'estadisticasAlbum/:id', component: EstadisticasAlbumComponent,  canActivate: [authGuard], data: { roles: 'artista' }},
      { path: 'seguidos/:nombreUsuario', component: SeguidosComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'seguidos', component: SeguidosComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'seguidores/:nombreUsuario', component: SeguidoresComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'seguidores', component: SeguidoresComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'subir-album', component: SubirAlbumComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'subir-cancion', component: SubirCancionComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'notificaciones', component: NotificacionesComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'mis-noizzys', component: MisNoizzysComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'noizzys/:nombreUsuario', component: SusNoizzysComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'cancionesFavs/:nombreUsuario', component: CancionesFavsComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'noizzitos/:id', component: NoizzitosComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'top-artistas', component: TopArtistasComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'mis-playlist', component: MisPlaylistComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'historial-canciones', component: HistorialCancionesComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'playlists-publicas/:nombreUsuario', component: PlaylistsPublicasComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'mis-canciones', component: MisCancionesComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'mis-albumes', component: MisAlbumesComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'playlists-con-cancion/:id', component: PlaylistsConCancionComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'usuarios-likes-album/:id', component: UsuariosLikesAlbumComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'usuarios-likes/:id', component: UsuariosLikesComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'canciones/:nombreUsuario', component: CancionesComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'albumes/:nombreUsuario', component: AlbumesComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
    ]
  }
];