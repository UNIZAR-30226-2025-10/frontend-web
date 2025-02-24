import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentTrackSource = new BehaviorSubject<any>(null);
  currentTrack$ = this.currentTrackSource.asObservable();

  setTrack(track: any) {
    this.currentTrackSource.next(track);
  }
}
