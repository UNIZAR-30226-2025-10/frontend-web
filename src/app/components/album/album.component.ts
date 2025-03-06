import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent /*implements OnInit*/ {
  album: any = null;
  artistNames: string = '';
  sidebarOpen = false;


  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.album = this.route.snapshot.paramMap.get('id');
    if (this.album) {
      //this.getAlbum(albumId);
    }
    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });
  }

  canciones = [
    { nombre: "Canción 1", duracion: "3:15", foto:"" },
    { nombre: "Canción 2", duracion: "4:05",foto:"" },
    { nombre: "Canción 3", duracion: "2:45", foto:"" },
    { nombre: "Canción 5", duracion: "2:45", foto:"" },
    { nombre: "Canción 6", duracion: "2:45", foto:""}
];


  /*getAlbum(albumId: string) {
    this.authService.getAlbum(albumId).subscribe((data: any) => {
      this.album = data;
      this.artistNames = this.album.artists.map((a: any) => a.name).join(', ');
    });
  }

  playTrack(track: any) {
    this.playerService.setTrack(track);
  }*/
}
