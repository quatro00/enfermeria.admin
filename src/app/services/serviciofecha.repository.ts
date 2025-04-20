import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServicioFechaService {

  service:string = 'ServicioFecha';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

    

  AsignarOferta(id:string, request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/api/${this.service}/${id}/asignar-oferta`,request);
  }

  Get(servicioId?:string):Observable<any>{
    let params = new HttpParams();

    if (servicioId) {
      params = params.set('ServicioId', servicioId);
    }

    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}`,{params});
  }
}