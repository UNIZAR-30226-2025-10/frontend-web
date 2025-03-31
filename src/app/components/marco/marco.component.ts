import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BuscadorComponent } from '../buscador/buscador.component';
import { MusicPlayerComponent } from '../music-player/music-player.component';
import { ResultadosComponent } from '../resultados/resultados.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarService } from '../../services/sidebar.service';


@Component({
  selector: 'app-marco',
  standalone: true,
  imports: [CommonModule, SidebarComponent, BuscadorComponent, MusicPlayerComponent, RouterModule],
  templateUrl: './marco.component.html',
  styleUrls: ['./marco.component.css'] 
})
export class MarcoComponent implements OnInit {
  sidebarOpen: boolean = false;
  messageReceived: string = '';

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarOpen$.subscribe(isOpen => {
      this.sidebarOpen = isOpen;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
