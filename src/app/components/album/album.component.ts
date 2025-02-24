import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { PlayerService } from '../../services/player.service';

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

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (albumId) {
      this.getAlbum(albumId);
    }
  }

  getAlbum(albumId: string) {
    this.spotifyService.getAlbum(albumId).subscribe((data: any) => {
      this.album = data;
      this.artistNames = this.album.artists.map((a: any) => a.name).join(', ');
    });
  }

  playTrack(track: any) {
    this.playerService.setTrack(track);
  }
}

