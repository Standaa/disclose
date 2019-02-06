import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

   private loader$ = new Subject<any>();
   loadingChangeEmitted$ = this.loader$.asObservable();

   emitLoadingChange(isLoading: boolean) {
       this.loader$.next(isLoading);
   }

   setUser(user) {
     localStorage.setItem('user', JSON.stringify(user));
   }

   getUser() {
     const cachedUser = JSON.parse(localStorage.getItem('user'));
     return cachedUser;
   }

}
