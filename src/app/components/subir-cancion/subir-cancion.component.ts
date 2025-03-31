import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SubirCloudinary } from '../../services/subir-cloudinary.service';

@Component({
  selector: 'app-subir-cancion',
  imports: [RouterModule, CommonModule],
  templateUrl: './subir-cancion.component.html',
  styleUrls: ['./subir-cancion.component.css']
})
export class SubirCancionComponent implements OnInit {
  albumes: any[] = []; // Lista de álbumes disponibles
  isDropdownOpen: boolean = false; // Controla si el menú desplegable está abierto
  selectedAlbum: string = 'Selecciona el álbum al que deseas asociar la canción'; // Texto del álbum seleccionado
  selectedAlbumId: number = 0; // ID del album seleccionado
  selectedAlbumImage: string | null = null; // Imagen del álbum seleccionado
  mostrarSubsecciones: boolean = false; // Controla la visibilidad de las subsecciones
  mostrarPopup: boolean = false; // Controla la visibilidad del popup
  archivoSeleccionado!: File; // Almacena el archivo seleccionado
  etiquetas: any[] = []; // Lista de etiquetas disponibles
  etiquetasSeleccionadas: any[] = []; // Lista de etiquetas seleccionadas (máximo 3)
  isEtiquetaDropdownOpen: boolean = false; // Controla si el desplegable de etiquetas está abierto
  mensajeError: string = "";
  isModalAlbumOpen: boolean = false; // Controla la visibilidad del modal
  nuevoAlbum: any = { nombre: '', imagen: null }; // Datos del nuevo álbum
  file!: File; // Archivo seleccionado para la imagen
  nombreArchivo: string = '';
  albumCreado: boolean = false;

  constructor(private authService: AuthService,  private subirCloudinary: SubirCloudinary) {}

  ngOnInit(): void {
    this.cargarAlbumes(); // Cargar los álbumes al inicializar el componente
    this.cargarEtiquetas(); // Cargar las etiquetas al inicializar el componente
  }

  cargarAlbumes(): void {
    this.authService.pedirMisAlbumesArtista().subscribe({
      next: (response) => {
        if (response && response.albumes) {
          this.albumes = response.albumes; // Asignar los álbumes a la lista
        } else {
          console.error('No se encontraron álbumes');
        }
      },
      error: (err) => {
        console.error('Error al obtener los álbumes:', err);
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen; // Alterna el estado del menú desplegable
  }

  selectAlbum(album: any): void {
    if (album.id === 'crear') {
      console.log('Crear Álbum seleccionado');
      // Aquí puedes implementar lógica para la creación de un nuevo álbum
    } else {
      this.selectedAlbum = album.nombre; // Actualiza el álbum seleccionado
      this.selectedAlbumId = album.id; // Actualiza el ID seleccionado
      this.selectedAlbumImage = album.fotoPortada; // Actualiza la imagen del álbum seleccionado
      this.mostrarSubsecciones = true; // Activa las subsecciones
      this.albumCreado = false;
    }
    this.isDropdownOpen = false; // Cierra el menú desplegable
  }
  abrirPopupCrearAlbum(): void {
    this.mostrarPopup = true; // Muestra el popup
    this.isDropdownOpen = false; // Cierra el menú desplegable
  }

  cerrarPopup(): void {
    this.mostrarPopup = false; // Oculta el popup
  }

  onDescripcionAlbumInput(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement;
    this.nuevoAlbum.descripcion = textareaElement.value; // Actualiza la descripción del álbum
  }

  crearAlbum(): void {
    console.log('Álbum creado:', this.nuevoAlbum);
    // Aquí puedes enviar los datos del nuevo álbum al backend
    this.cerrarPopup(); // Cierra el popup después de crear el álbum
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Previene el comportamiento predeterminado
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.add('drag-over'); // Agrega una clase para resaltar el área
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('drag-over'); // Elimina la clase de resaltado
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('drag-over'); // Elimina la clase de resaltado
  
    if (this.archivoSeleccionado) {
      alert('Ya has subido un archivo. No puedes subir más.');
      return;
    }
  
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const archivo = event.dataTransfer.files[0];
      const tiposValidos = ['audio/mpeg', 'audio/mp3']; // Tipos MIME válidos
      if (tiposValidos.includes(archivo.type)) {
        this.archivoSeleccionado = archivo; // Guarda el archivo seleccionado
        console.log('Archivo seleccionado:', archivo);
      } else {
        alert('Por favor, sube un archivo MP3 válido.');
      }
    }
  }

  eliminarArchivo(): void {
    this.archivoSeleccionado = null!; // Elimina el archivo seleccionado
    console.log('Archivo eliminado');
  }

  cargarEtiquetas(): void {
    console.log('Iniciando la carga de etiquetas...'); // Mensaje inicial
    this.authService.pedirEtiquetas().subscribe({
      next: (response) => {
        console.log('Respuesta recibida del servicio:', response); // Verifica la respuesta completa
  
        if (Array.isArray(response) && response.length > 0) {
          console.log('Etiquetas encontradas:', response); // Verifica las etiquetas en la respuesta
          // Mapea la lista de strings a un array de objetos con un id generado
          this.etiquetas = response.map((tag: string, index: number) => ({
            id: index + 1, 
            nombre: tag    
          }));
          console.log('Etiquetas procesadas:', this.etiquetas);
        } else {
          console.error('No se encontraron etiquetas en la respuesta'); 
        }
      },
      error: (err) => {
        console.error('Error al obtener las etiquetas:', err); 
      }
    });
  }

  onEtiquetaSeleccionada(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions); // Obtiene las opciones seleccionadas
  
    if (selectedOptions.length > 3) {
      alert('Solo puedes seleccionar un máximo de 3 etiquetas.');
      // Deselecciona las opciones adicionales
      selectedOptions.forEach((option, index) => {
        if (index >= 3) {
          option.selected = false;
        }
      });
      return;
    }
  
    // Actualiza las etiquetas seleccionadas
    this.etiquetasSeleccionadas = selectedOptions.map(option => ({
      nombre: option.value // Usa el valor (nombre de la etiqueta)
    }));
  
    console.log('Etiquetas seleccionadas:', this.etiquetasSeleccionadas);
  }

  selectEtiqueta(etiqueta: any): void {
    // Verifica si la etiqueta ya está seleccionada
    const yaSeleccionada = this.etiquetasSeleccionadas.some(
      (etiquetaSeleccionada) => etiquetaSeleccionada.nombre === etiqueta.nombre
    );
  
    if (yaSeleccionada) {
      // Si ya está seleccionada, la elimina de la lista
      this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(
        (etiquetaSeleccionada) => etiquetaSeleccionada.nombre !== etiqueta.nombre
      );
    } else {
      // Si no está seleccionada, verifica que no exceda el límite de 3
      if (this.etiquetasSeleccionadas.length < 3) {
        this.etiquetasSeleccionadas.push(etiqueta);
      } else {
        alert('Solo puedes seleccionar un máximo de 3 etiquetas.');
      }
    }
  
    console.log('Etiquetas seleccionadas:', this.etiquetasSeleccionadas);
  }

  toggleEtiquetaDropdown(): void {
    this.isEtiquetaDropdownOpen = !this.isEtiquetaDropdownOpen; // Alterna el estado del desplegable
  }

  getTextoEtiquetasSeleccionadas(): string {
    if (this.etiquetasSeleccionadas.length > 0) {
      return this.etiquetasSeleccionadas.map(etiqueta => etiqueta.nombre).join(', ');
    }
    return 'Selecciona 3 etiquetas que definan la canción';
  }

  isEtiquetaSeleccionada(etiqueta: any): boolean {
    return this.etiquetasSeleccionadas.some(e => e.nombre === etiqueta.nombre);
  }

  // Abre el modal para crear un álbum
  abrirModalAlbum(): void {
    this.isModalAlbumOpen = true;
  }

  // Cierra el modal para crear un álbum
  cerrarModalAlbum(): void {
    this.isModalAlbumOpen = false;
    this.nuevoAlbum = { nombre: '', imagen: null }; // Reinicia los datos del álbum
  }

  // Maneja la selección de un archivo mediante el input
  onFileSelected(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.validarArchivo(archivo);
    }
  }

  // Valida el archivo seleccionado
  validarArchivo(archivo: File): void {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg']; // Tipos MIME válidos
    if (tiposValidos.includes(archivo.type)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.nuevoAlbum.imagen = e.target.result; // Asigna la imagen seleccionada
        this.file = e.target.result;
        this.nombreArchivo = archivo.name; // Guarda el nombre del archivo
        this.mensajeError = ''; // Limpia el mensaje de error
      };
      reader.readAsDataURL(archivo);
    } else {
      this.mensajeError = 'Solo se permiten archivos JPEG, JPG o PNG.';
      this.nuevoAlbum.imagen = null; // Limpia la imagen seleccionada
      this.nombreArchivo = ''; // Limpia el nombre del archivo
    }
  }

  // Guarda el álbum
  guardarAlbum(): void {
    if (!this.nuevoAlbum.nombre || !this.nuevoAlbum.imagen) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Aquí puedes agregar la lógica para guardar el álbum en el backend
    console.log('Álbum creado:', this.nuevoAlbum);
    this.selectedAlbumImage = this.nuevoAlbum.imagen;
    this.selectedAlbum = this.nuevoAlbum.nombre;
    this.selectedAlbumId = 1;
    this.albumCreado = true;

    // Cierra el modal y reinicia los datos
    this.cerrarModalAlbum();
    this.isDropdownOpen = false; // Cierra el menú desplegable
  }

   // Maneja el evento de entrada en el campo de nombre del álbum
  onNombreAlbumInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.nuevoAlbum.nombre = inputElement.value; // Actualiza el nombre del álbum
  }

  onDragOverImagen(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.add('drag-over'); // Agrega una clase para resaltar el área
  }
  
  onDragLeaveImagen(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('drag-over'); // Elimina la clase de resaltado
  }
  
  // Maneja la selección de un archivo mediante arrastrar y soltar
  onDropImagen(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('drag-over'); // Elimina la clase de resaltado

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const archivo = event.dataTransfer.files[0];
      this.validarArchivo(archivo);
    }
  }
    
  // Funcion final y subida a base de datos
  agregarCancion(nombreCancion: string, artistasFt: string): void {
    const listaArtistasFt = artistasFt.split(",");
    console.log(listaArtistasFt);

    if(this.albumCreado) {
      this.subirCloudinary.uploadFile(this.file, 'albumes').pipe(
        switchMap(( url ) => {
          console.log(`URL de la imagen subida: ${url}`);
          return this.authService.crearAlbum(this.nuevoAlbum.nombre, url);
          })
          ).subscribe({
          next: () => {
          },
          error: (error) => {
            console.error("Error al guardar los nuevos datos de album:", error);
          },
          complete: () => {
            console.log("Datos de album guardados con éxito");
          }
        });
    }

    if (nombreCancion && listaArtistasFt) {
      console.log(`Album: ${this.selectedAlbum}, ID: ${this.selectedAlbumId}\nTítulo de la canción: ${nombreCancion}\nEtiquetas: ${this.etiquetasSeleccionadas.map(etiqueta => etiqueta.nombre)}\nArtistas featured: ${listaArtistasFt}\n`);
    } else {
      console.log('Campos vacios');
    }

    this.mensajeError = '';

    this.subirCloudinary.uploadSong(this.archivoSeleccionado, 'canciones').pipe(
    switchMap(({ url, duration }) => {
      console.log(`URL de la canción subida: ${url}`);
      console.log(`Duración de la canción: ${duration} segundos`);
      return this.authService.crearCancion(nombreCancion, this.selectedAlbumId, duration, url, this.etiquetasSeleccionadas.map(etiqueta => etiqueta.nombre), listaArtistasFt);
      })
      ).subscribe({
        next: () => {
        },
        error: (error) => {
          console.error("Error al guardar los nuevos datos de cancion:", error);
        },
        complete: () => {
          console.log("Datos de cancion guardados con éxito");
        }
      });
  }
}