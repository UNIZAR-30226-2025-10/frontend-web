import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlApi ='http://localhost:5000'
  
  constructor(private http: HttpClient) { }

  private get(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/${endpoint}`);
  }

  public getAllUsers(): Observable<any> {
    return this.get('get-all-users');
  }

  //FUNCION QUE PIDE A LA API TODOS LOS RESULTADOS (PARA EL BUSCADOR) (HACERLA, LO PONGO PARA QUE NO DE ERROR)
  public getAll(query: string): Observable<any> {
    return this.get('todo');
  }

  //FUNCION QUE PIDE A LA API UN ALBUM (HACERLA, LO PONGO PARA QUE NO DE ERROR)
  public getAlbum(albumId: string): Observable<any> {
    return this.get('album');
  }
  
}
