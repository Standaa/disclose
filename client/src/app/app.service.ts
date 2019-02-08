import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = 'https://disclose-server.herokuapp.com/user/upload/informations';
  apiUrl2 = 'http://localhost:5000/user/upload/informations';

  uploadUserInformationsToAuthority (formData:FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data'
        // 'Authorization': 'my-auth-token'
      })
    };
    return this.httpClient.post(this.apiUrl, formData);
  }
}
