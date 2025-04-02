import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { ResultadosService } from '../../services/resultados.service';
import { LimpiarBuscadorService } from '../../services/limpiar-buscador.service';  // Ajusta la ruta según corresponda
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { TokenService } from '../../services/token.service';
import { ActualizarFotoPerfilService } from '../../services/actualizar-foto-perfil.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class BuscadorComponent implements OnInit, OnDestroy{
  searchQuery: string = '';
  sidebarOpen = false;
  previousUrl: string = '';
  foto: string = '';

  tieneNotificaciones: boolean=false;


  private searchQuerySubject: Subject<string> = new Subject(); 
  private subscription!: Subscription;

  @Output() searchResults = new EventEmitter<any>(); // Emitirá los resultados al componente padre

  constructor(private router: Router, private sidebarService: SidebarService, private resultadosService: ResultadosService, private limpiarBuscadorService: LimpiarBuscadorService, private authService: AuthService, private tokenService: TokenService,  private actFotoService: ActualizarFotoPerfilService,private socketService: SocketService) {}


  ngOnInit() {

    this.previousUrl = this.router.url;
    this.foto = this.tokenService.getUser().fotoPerfil;

    this.subscription = this.limpiarBuscadorService.limpiarBuscador$.subscribe(data => {
      if (data === true) {
        // Aquí puedes limpiar el campo de búsqueda, por ejemplo
        this.searchQuery = '';  // Limpiar el input de búsqueda
      }
    });

   

    this.searchQuerySubject.pipe(
      debounceTime(500),  
      switchMap(query => {
        return this.authService.buscador(query);
      }),
      catchError(error => {
        console.error('Error al obtener los datos', error);
        return [];
      })
    ).subscribe({
      next: (data) => {

        this.searchResults.emit(data); // Emitimos los resultados al componente padre

        // Guardamos los resultados en el servicio antes de navegar
        this.resultadosService.setResultados(data);

        // Si hay resultados, navegamos a la nueva ruta
        this.router.navigate(['/home/resultados'], { queryParams: { search: this.searchQuery } });
      },
      error: (error) => {
        console.error('Error al obtener los datos', error);
      }
    });

    this.socketService.connect();

    this.socketService.listen('invite-to-playlist-ws').subscribe((data) => {
      console.log('Nueva invitación recibida:', data);
      this.tieneNotificaciones = true; 
    });

  }



  ngOnDestroy(): void {
    // Nos desuscribimos para evitar pérdidas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.searchQuerySubject.unsubscribe();
  } 

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarService.toggleSidebar();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goPerfil() {
    if (this.tokenService.getTipo() === "artista") {
      this.router.navigate(['/home/miPerfilArtista']);  
    }else {
      this.router.navigate(['/home/miPerfilOyente']);
    }
  }

  onSearchInputChange() {
    // Emitimos el valor de búsqueda cuando cambia el input
    this.searchQuerySubject.next(this.searchQuery);
  }

  verNotificaciones() {
    this.tieneNotificaciones = false; 
  }
}

