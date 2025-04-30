import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  service:string = 'Municipio';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Get(estadoId?:string):Observable<any>{

    let params = new HttpParams();
    
    if (estadoId) {
        params = params.set('EstadoId', estadoId);
      }
    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}`,{ params });
  }
}