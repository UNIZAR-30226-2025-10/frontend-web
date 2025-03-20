import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root', // Esto hace que el servicio sea un singleton en toda la app
})
export class SocketService {
  private socket!: Socket;
  private SERVER_URL = 'http://localhost:5000'; // Cambia por tu servidor

  constructor(private tokenService: TokenService) {}

  connect() {
    const token = this.tokenService.getToken(); // Asegúrate de obtener el token JWT

    this.socket = io('http://localhost:5000', {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    this.socket.on('connect', () => {
      console.log('Conectado a Socket.IO con ID:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión a Socket.IO:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado de Socket.IO');
    });
  }

  // Crear un Observable para escuchar eventos
  listen(eventName: string): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on(eventName, (data) => {
          observer.next(data); // Emitir los datos cuando el evento sea recibido
        });

        // Manejo de error (opcional)
        this.socket.on('error', (err) => {
          observer.error(err); // Emitir error si ocurre
        });
      } else {
        observer.error('El socket no está inicializado');
      }
    });
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
