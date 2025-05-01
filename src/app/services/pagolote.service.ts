import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PagoLoteService {

  service:string = 'PagoLote';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Crear(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/${this.service}`,request);
  }

  GetPagoLote(periodo?:any, estatusPagoLote?:any):Observable<any>{
    let params = new HttpParams();

    if(periodo != null)
    params = params.append('Periodo', periodo);
   
    if(estatusPagoLote != null)
      params = params.append('EstatusPagoLoteId', estatusPagoLote);

    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}`,{params});
  }

  SubirDeposito(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/${this.service}/subir-deposito`,formData);
  }

  DescargarDeposito(pagoLoteId: string, referencia:string) {

    const params = new HttpParams()
    .set('pagoLoteId', pagoLoteId)
    .set('referencia', referencia);

    return this.http.get(`${environment.apiBaseUrl}/${this.service}/descargar-deposito`, {
    params,
    responseType: 'blob'
  });
  }
}