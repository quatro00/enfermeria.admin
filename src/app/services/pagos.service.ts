import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/auth/login-request.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../models/auth/login-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/auth/user-model.models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  service:string = 'Pago';
  
  constructor(private http:HttpClient, private cookieService: CookieService) { }

  GetServiciosPorPagar(id:string):Observable<any>{
    let params = new HttpParams();
    params = params.append('id', id);

    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}/GetServiciosPorPagar/${id}`);
  }

  RegistrarPagoServicios(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/${this.service}/RegistrarPagoServicios`,request);
  }

  GetPagos(pagoLoteId?:string):Observable<any>{
    let params = new HttpParams();
    params = params.append('PagoLoteId', pagoLoteId);

    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}`, {params});
  }

  GetDepositos(pagoLoteId?:string):Observable<any>{
    let params = new HttpParams();
    params = params.append('PagoLoteId', pagoLoteId);

    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}/ver-depositos`, {params});
  }

}
