import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OpcionesRegistroComponent } from './components/opciones-registro/opciones-registro.component';
import { RegistroOyenteComponent } from './components/registro-oyente/registro-oyente.component';
import { RegistroArtistaComponent } from './components/registro-artista/registro-artista.component';
import { OlvidoContrasena1Component } from './components/olvido-contrasena1/olvido-contrasena1.component';
import { OlvidoContrasena2Component } from './components/olvido-contrasena2/olvido-contrasena2.component';
import { OlvidoContrasena3Component } from './components/olvido-contrasena3/olvido-contrasena3.component';
//import { AlbumComponent } from './components/album/album.component';
import { MarcoComponent } from './components/marco/marco.component';
import { HomeComponent } from './components/home/home.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MiPerfilOyenteComponent } from './components/mi-perfil-oyente/mi-perfil-oyente.component';
import { MiPerfilArtistaComponent } from './components/mi-perfil-artista/mi-perfil-artista.component';
import { IntroducirCodigoComponent } from './components/introducir-codigo/introducir-codigo.component';
import { PendienteComponent } from './components/pendiente/pendiente.component';
import { PedirContrasenyaComponent } from './components/pedir-contrasenya/pedir-contrasenya.component';
import { AdminComponent } from './components/admin/admin.component';
import { SeguidosComponent } from './seguidos/seguidos.component';
import { SeguidoresComponent } from './seguidores/seguidores.component';

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
  { path: 'pendiente', component: PendienteComponent},
  { path: 'pedirContrasenya', component: PedirContrasenyaComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'home', component: MarcoComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      /*{ path: 'album/:id', component: AlbumComponent},*/
      { path: 'home', component: HomeComponent},
      { path: 'resultados', component: ResultadosComponent},
      { path: 'resultados', component: ResultadosComponent},
      { path: 'miPerfilOyente', component: MiPerfilOyenteComponent},
      { path: 'miPerfilArtista', component: MiPerfilArtistaComponent},
      {path: 'seguidos/:nombreUsuario', component: SeguidosComponent},
      {path: 'seguidores/:nombreUsuario', component: SeguidoresComponent},

    ]
  }
];
