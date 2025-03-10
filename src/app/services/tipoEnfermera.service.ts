import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TipoEnfermeraService {

  service:string = 'TipoEnfermera';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Get():Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}`);
  }

  GetActivos():Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}/GetActivos`);
  }
  
  Create(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}`,request);
  }

  Update(id:string, request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/api/${this.service}/${id}`,request);
  }

  Activar(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}/Activar`,request);
  }

  Desactivar(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}/Desactivar`,request);
  }
}