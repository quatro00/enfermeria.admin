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

  TerminarOferta(id:string):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/api/${this.service}/${id}/terminar-oferta`,{});
  }

  CancelarOferta(id:string):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/api/${this.service}/${id}/cancelar-oferta`,{});
  }

  DesasignarOferta(id:string):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/api/${this.service}/${id}/liberar-oferta`,{});
  }

  Get(servicioId?:string):Observable<any>{
    let params = new HttpParams();

    if (servicioId) {
      params = params.set('ServicioId', servicioId);
    }

    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}`,{params});
  }

  GetGuardias(
    noServicio?:string, 
    estatusServicioFechaId?:string, 
    fechaInicio?:any, 
    fechaFin?:any
  ):Observable<any>{
    let params = new HttpParams();

    if (noServicio) {
      params = params.set('NoServicio', noServicio);
    }

    if (estatusServicioFechaId) {
      params = params.set('EstatusServicioFechaId', estatusServicioFechaId);
    }

    if (fechaInicio) {
      params = params.set('FechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('FechaFin', fechaFin);
    }


    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}/obtener-guardias`,{params});
  }

  GetServicioFechaFiltros(
    colaboradorId?:string, 
    estatusServicioFechaId?:string, 
    fechaInicio?:any, 
    fechaFin?:any
  ):Observable<any>{
    let params = new HttpParams();

    if (colaboradorId) {
      params = params.set('ColaboradorAsignadoId', colaboradorId);
    }

    if (estatusServicioFechaId) {
      params = params.set('EstatusServicioFechaId', estatusServicioFechaId);
    }

    if (fechaInicio) {
      params = params.set('Inicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('Fin', fechaFin);
    }


    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}/obtener-guardias-fechas`,{params});
  }

  GetServiciosFechaByServicio(servicioId:string):Observable<any>{
    let params = new HttpParams();
    params = params.set('ServicioId', servicioId);
    
    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}/obtener-servicios-fechas`,{params});
  }

  AplicarDescuentos(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}/asignar-descuentos`,request);
  }
}