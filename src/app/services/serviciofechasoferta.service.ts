import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServicioFechasOfertaService {

  service:string = 'ServicioFechasOferta';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

 

  Get(servicioFechaId?:string):Observable<any>{
    let params = new HttpParams();

    if (servicioFechaId) {
      params = params.set('ServicioFechaId', servicioFechaId);
    }

    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}`,{params});
  }
}