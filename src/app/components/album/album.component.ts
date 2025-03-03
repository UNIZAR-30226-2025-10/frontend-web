import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { PlayerService } from '../../services/player.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  album: any = null;
  artistNames: string = '';
  sidebarOpen = false;


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private playerService: PlayerService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (albumId) {
      this.getAlbum(albumId);
    }
    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });
  }

  getAlbum(albumId: string) {
    this.apiService.getAlbum(albumId).subscribe((data: any) => {
      this.album = data;
      this.artistNames = this.album.artists.map((a: any) => a.name).join(', ');
    });
  }

  playTrack(track: any) {
    this.playerService.setTrack(track);
  }
}

