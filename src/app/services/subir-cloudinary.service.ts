import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubirCloudinary {

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para subir archivo a Cloudinary con la firma
  uploadFile(file: File): Observable<string> {
    return this.authService.pedirFirma().pipe(
      switchMap(signatureData => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signatureData.api_key);
        formData.append('timestamp', signatureData.timestamp.toString());
        formData.append('signature', signatureData.signature);
        formData.append('folder', signatureData.folder);
  
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`;
  
        return this.http.post<any>(cloudinaryUrl, formData).pipe(
          map(response => response.secure_url)
        );
      }),
      catchError(error => {
        console.error('Error al subir la imagen:', error);
        return throwError(() => new Error('Error al subir la imagen'));
      })
    );
  }

  
}
