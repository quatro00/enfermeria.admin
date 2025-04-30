import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  service:string = 'Servicio';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Crear(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}`,request);
  }
  
  DescargarCotizacion(id: string) {
    return this.http.get(`${environment.apiBaseUrl}/api/${this.service}/ObtenerCotizacion/${id}`, {
      responseType: 'blob' // importante para recibir PDF
    });
  }

  EnviarCotizacionPorCorreo(id: string, correoAdicional: string) {
    const url = `${environment.apiBaseUrl}/api/${this.service}/enviar-cotizacion/${id}?correoAdicional=${encodeURIComponent(correoAdicional)}`;
    return this.http.post(url, null); // null porque no se envía body
  }

  AplicarDescuento(id: string, monto: string) {
    const url = `${environment.apiBaseUrl}/api/${this.service}/aplicar-descuento/${id}?monto=${encodeURIComponent(monto)}`;
    return this.http.post(url, null); // null porque no se envía body
  }

  GetAll(no?:string, nombrePaciente?:string, estadoId?:string, estatus?:string):Observable<any>{
    let params = new HttpParams();

    if (no) {
      params = params.set('No', no);
    }

    if (nombrePaciente) {
      params = params.set('NombrePaciente', nombrePaciente);
    }

    if (estadoId) {
      params = params.set('Estado', estadoId);
    }

    if (estatus) {
      params = params.set('Estatus', estatus);
    }


    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}`,{params});
  }

  CancelarServicio(id:any):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/api/${this.service}/${id}/cancelar-cotizacion`,{});
  }

  AdjuntarReferencia(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/${this.service}/adjuntar-referencia`,formData);
  }

  DescargarPago(servicioId:string) {

    const params = new HttpParams()
    .set('servicioId', servicioId);

    return this.http.get(`${environment.apiBaseUrl}/api/${this.service}/descargar-pago`, {
    params,
    responseType: 'blob'
  });
  }

}