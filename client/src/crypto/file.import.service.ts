import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileImportService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getZkCircuitAndProvingKey = (): Observable<any> => {
    return forkJoin(
       this.httpClient.get('crypto/authority.cir'),
       this.httpClient.get('crypto/proving_key.json')
     );
   }

}
