import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServicioOfertaService {

  service:string = 'ServicioOferta';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Get(request:any):Observable<any>{
    let params = new HttpParams();

    if (request.servicioId) {
      params = params.set('ServicioId', request.servicioId);
    }
    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}`,{params});
  }
  
 
}