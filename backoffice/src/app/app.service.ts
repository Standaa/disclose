import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  getUsersPendingVerification (): Observable<any> {
    return this.httpClient.get('http://localhost:3030/users/pending/verification');
  }

  setUserVerified(userId): Observable <any> {
    return this.httpClient.get(`http://localhost:3030/user/verify/${userId}`);
  }

}
