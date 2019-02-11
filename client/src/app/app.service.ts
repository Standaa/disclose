import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = environment.apiUrl;

  uploadUserInformationsToAuthority (formData:FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
        // 'Authorization': 'my-auth-token'
      })
    };
    return this.httpClient.post(`${this.apiUrl}/user/upload/informations`, formData);
  }
}
