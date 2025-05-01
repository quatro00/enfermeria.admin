import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class EncuestaPlantillaPreguntaService {

  service:string = 'EncuestaPlantillaPregunta';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Crear(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/${this.service}`,request);
  }

  GetAll(id):Observable<any>{
    let params = new HttpParams();
    params = params.set('plantillaId', id);
    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}/${id}`,{});
  }

  GetById(id:any):Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}/${id}`);
  }

  Desactivar(id:any):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/${this.service}/${id}/desactivar`,{});
  }

  Reactivar(id:any):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/${this.service}/${id}/reactivar`,{});
  }
  Update(id:string, request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/${this.service}/${id}`,request);
  }

}