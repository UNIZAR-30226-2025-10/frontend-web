import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-seguidos',
  imports: [RouterModule, CommonModule],
  templateUrl: './seguidos.component.html',
  styleUrls: ['./seguidos.component.css']
})
export class SeguidosComponent {
  // Lista de usuarios
  usuarios = [
  { correo: 1, nombreUsuario: 'Usuario1', img: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { correo: 2, nombreUsuario: 'Usuario2', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { correo: 3, nombreUsuario: 'Usuario3', img: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { correo: 4, nombreUsuario: 'Usuario4', img: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { correo: 5, nombreUsuario: 'Usuario5', img: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { correo: 6, nombreUsuario: 'Usuario6', img: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { correo: 7, nombreUsuario: 'Usuario7', img: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { correo: 8, nombreUsuario: 'Usuario8', img: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { correo: 9, nombreUsuario: 'Usuario9', img: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { correo: 10, nombreUsuario: 'Usuario10', img: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { correo: 11, nombreUsuario: 'Usuario11', img: 'https://randomuser.me/api/portraits/women/7.jpg' },
  { correo: 12, nombreUsuario: 'Usuario12', img: 'https://randomuser.me/api/portraits/men/6.jpg' },
  { correo: 13, nombreUsuario: 'Usuario13', img: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { correo: 14, nombreUsuario: 'Usuario14', img: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { correo: 15, nombreUsuario: 'Usuario15', img: 'https://randomuser.me/api/portraits/women/9.jpg' },
  { correo: 16, nombreUsuario: 'Usuario16', img: 'https://randomuser.me/api/portraits/men/8.jpg' },
  { correo: 17, nombreUsuario: 'Usuario17', img: 'https://randomuser.me/api/portraits/women/10.jpg' },
  { correo: 18, nombreUsuario: 'Usuario18', img: 'https://randomuser.me/api/portraits/men/9.jpg' }
];

// Lista de relaciones de quien sigue a quien 
  sigue = [
  { Seguidor_correo: 1, Seguido_correo: 2 },
  { Seguidor_correo: 1, Seguido_correo: 3},
  { Seguidor_correo: 2, Seguido_correo: 12 },
  { Seguidor_correo: 1, Seguido_correo: 4 },
  { Seguidor_correo: 1, Seguido_correo: 5 },
  { Seguidor_correo: 1, Seguido_correo: 6 },
  { Seguidor_correo: 6, Seguido_correo: 7 },
  { Seguidor_correo: 7, Seguido_correo: 8 },
  { Seguidor_correo: 8, Seguido_correo: 9},
  { Seguidor_correo: 9, Seguido_correo: 10},
  { Seguidor_correo: 10, Seguido_correo: 11},
  { Seguidor_correo: 11, Seguido_correo: 12 },
  { Seguidor_correo: 12, Seguido_correo: 13 },
  { Seguidor_correo: 13, Seguido_correo: 14 },
  { Seguidor_correo: 14, Seguido_correo: 15 },
  { Seguidor_correo: 15, Seguido_correo: 16 },
  { Seguidor_correo: 16, Seguido_correo: 17 },
  { Seguidor_correo: 17, Seguido_correo: 18 }
];

// Lista de artistas
  artistas = [
  { usuarioCorreo: 1 },
  { usuarioCorreo: 2 },
  { usuarioCorreo: 4 },
  { usuarioCorreo: 5 },
  { usuarioCorreo: 7 },
  { usuarioCorreo: 8 },
  { usuarioCorreo: 11 },
  { usuarioCorreo: 12 },
  { usuarioCorreo: 15 },
  { usuarioCorreo: 16 }
];


  seguidosDeUsuario: any[] = [];
  nombreUsuario: string | null = null;
  filteredSeguidos: any[] = [];
  activeFilter: string = 'all';

  constructor(private route: ActivatedRoute) {}
  

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.nombreUsuario = params.get('nombreUsuario');
      this.obtenerSeguidos();
    });
  }

  // Obtener los seguidos de un usuario específico
 // Obtener los seguidos de un usuario específico
obtenerSeguidos() {
  if (this.nombreUsuario) {
    // Buscar al usuario por su nombreUsuario
    const usuario = this.usuarios.find(u => u.nombreUsuario === this.nombreUsuario);

    if (usuario) {
      // Filtrar los seguidos de ese usuario
      this.seguidosDeUsuario = this.sigue
        .filter(seg => seg.Seguidor_correo === usuario.correo)
        .map(seg => {
          // Buscar el usuario seguido en la lista de usuarios para obtener sus datos
          const usuarioSeguido = this.usuarios.find(u => u.correo === seg.Seguido_correo);
          return {
            ...seg,
            tipo: this.artistas.some(a => a.usuarioCorreo === seg.Seguido_correo) ? 'artista' : 'oyente',
            img: usuarioSeguido ? usuarioSeguido.img : '', // Obtener la imagen del usuario seguido
            nombreUsuario: usuarioSeguido ? usuarioSeguido.nombreUsuario : 'Usuario desconocido', // Nombre del usuario seguido
          };
        });

      // Aplicar el filtro
      this.filterFollows(this.activeFilter);
    }
  }
}



  filterFollows(filter: string) {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.filteredSeguidos = this.seguidosDeUsuario;
    } else if (filter === 'artists') {
      this.filteredSeguidos = this.seguidosDeUsuario.filter(seguidor => seguidor.tipo === 'artista');
    }
  }

  isActive(filter: string): boolean {
    return this.activeFilter === filter;
  }

  goBack() {
    window.history.back();  
  }
  
}
