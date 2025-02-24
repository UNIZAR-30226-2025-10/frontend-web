import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OpcionesRegistroComponent } from './components/opciones-registro/opciones-registro.component';
import { RegistroOyenteComponent } from './components/registro-oyente/registro-oyente.component';
import { RegistroArtistaComponent } from './components/registro-artista/registro-artista.component';
import { OlvidoContrasena1Component } from './components/olvido-contrasena1/olvido-contrasena1.component';
import { OlvidoContrasena2Component } from './components/olvido-contrasena2/olvido-contrasena2.component';
import { OlvidoContrasena3Component } from './components/olvido-contrasena3/olvido-contrasena3.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { CallbackComponent } from './components/callback/callback.component';  
import { BuscadorComponent } from './components/buscador/buscador.component';
import { AlbumComponent } from './components/album/album.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'opcionesRegistro', component: OpcionesRegistroComponent},
  { path: 'registroOyente', component: RegistroOyenteComponent},
  { path: 'registroArtista', component: RegistroArtistaComponent},
  { path: 'olvidoContrasena1', component: OlvidoContrasena1Component},
  { path: 'olvidoContrasena2', component: OlvidoContrasena2Component},
  { path: 'olvidoContrasena3', component: OlvidoContrasena3Component}
];
