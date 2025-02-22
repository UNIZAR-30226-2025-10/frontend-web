import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OpcionesRegistroComponent } from './opciones-registro/opciones-registro.component';
import { RegistroOyenteComponent } from './registro-oyente/registro-oyente.component';
import { RegistroArtistaComponent } from './registro-artista/registro-artista.component';
import { OlvidoContrasena1Component } from './olvido-contrasena1/olvido-contrasena1.component';
import { OlvidoContrasena2Component } from './olvido-contrasena2/olvido-contrasena2.component';
import { OlvidoContrasena3Component } from './olvido-contrasena3/olvido-contrasena3.component';

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
