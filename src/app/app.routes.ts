import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OpcionesRegistroComponent } from './opciones-registro/opciones-registro.component';
import { RegistroOyenteComponent } from './registro-oyente/registro-oyente.component';
import { RegistroArtistaComponent } from './registro-artista/registro-artista.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'opcionesRegistro', component: OpcionesRegistroComponent},
  { path: 'registroOyente', component: RegistroOyenteComponent},
  { path: 'registroArtista', component: RegistroArtistaComponent}
];
