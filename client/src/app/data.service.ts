import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url = 'ws://localhost:3030';
  private socket;

  constructor() { }

  getMessages(): Observable <any> {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
