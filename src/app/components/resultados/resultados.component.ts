import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ResultadosComponent {
  @Input() artists: any[] = [];
  @Input() tracks: any[] = [];
  @Input() albums: any[] = [];
  @Input() playlists: any[] = [];

  sidebarOpen = false;


  constructor(private playerService: PlayerService, private router: Router,private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });
  }

  playTrack(track: any) {
    this.playerService.setTrack(track);
  }

  goToAlbum(albumId: string) {
    this.router.navigate(['/album', albumId]);
  }

}

