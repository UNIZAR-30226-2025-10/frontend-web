import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  actualizarFavSource = new BehaviorSubject<{ actualizarFavId: any} | null>(null);
  actualizarFav$ = this.actualizarFavSource.asObservable();

  constructor() { }

  actualizarFavMarco(id: any) {
    console.log('en actualizarFavMarco')
    this.actualizarFavSource.next({ actualizarFavId: id });
  }
}
