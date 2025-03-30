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
      { path: 'seguidores/:nombreUsuario', component: SeguidoresComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'notificaciones', component: NotificacionesComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } },
      { path: 'cancionesFavs/:nombreUsuario', component: CancionesFavsComponent,  canActivate: [authGuard], data: { roles: ['oyente', 'artista'] } }

    ]
  }
];