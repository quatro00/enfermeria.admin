import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  service:string = 'Colaborador';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Get(nombre?:string):Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}`);
  }

  GetColaboradores(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/${this.service}/GetColaboradores`,request);
  }

  Create(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/${this.service}`,request);
  }

  Update(id:string, request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/${this.service}/${id}`,request);
  }

  Activar(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/${this.service}/Activar`,request);
  }

  Desactivar(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/${this.service}/Desactivar`,request);
  }
}