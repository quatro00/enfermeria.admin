import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  service:string = 'Paciente';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Crear(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}`,request);
  }

  GetAll(nombre?:string, correoElectronico?:string):Observable<any>{
    let params = new HttpParams();

  if (nombre) {
    params = params.set('nombre', nombre);
  }

  if (correoElectronico) {
    params = params.set('correoElectronico', correoElectronico);
  }

    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}`,{params});
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