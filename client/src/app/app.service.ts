import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  uploadUserInformationsToAuthority (formData:FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
        // 'Authorization': 'my-auth-token'
      })
    };
    return this.httpClient.post('http://localhost:8080/user/upload/informations', formData);
  }
}
