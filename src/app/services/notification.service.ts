import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() { }

  /**
   * Muestra un mensaje de notificación tipo popup
   * @param mensaje El mensaje a mostrar
   * @param tipo El tipo de notificación (success, error, warning, info)
   * @param duracion Duración en milisegundos que el popup estará visible
   */
  showNotification(mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info' = 'info', duracion: number = 3000): void {
    const popup = document.createElement('div');
    
    // Estilos del popup
    popup.style.position = 'fixed';
    popup.style.bottom = '70px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 10px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '9999';
    popup.style.minWidth = '250px';
    popup.style.maxWidth = '350px';
    popup.style.fontFamily = 'Poppins, arial';
    popup.style.animation = 'fadeIn 0.3s ease-out';
    popup.style.textAlign = 'center';
    
    // Colores según el tipo
    popup.style.backgroundColor = '#000E3B';
    popup.style.color = 'white';

    // Permitir HTML en la notificación
    popup.innerHTML = mensaje; 

    // Añadir animaciones CSS
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
    `;
    document.head.appendChild(style);

    // Agregar al DOM
    document.body.appendChild(popup);

    // Eliminar después de la duración especificada
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.2s ease-in';
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 300);
    }, duracion);
}


  showSuccess(mensaje: string, duracion: number = 3000): void {
    this.showNotification(mensaje, 'success', duracion);
  }
  
  showError(mensaje: string, duracion: number = 3000): void {
    this.showNotification(mensaje, 'error', duracion);
  }
  
  showWarning(mensaje: string, duracion: number = 3000): void {
    this.showNotification(mensaje, 'warning', duracion);
  }
  
  showInfo(mensaje: string, duracion: number = 3000): void {
    this.showNotification(mensaje, 'info', duracion);
  }
}