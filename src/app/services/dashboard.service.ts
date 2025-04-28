import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { GetColaboradoresModel } from '../models/colaboradores/get-colabores-model';
import { CreateColaboradorModel } from '../models/colaboradores/create-colaborador-model';
import { UpdateColaboradorModel } from '../models/colaboradores/update-colaborador-model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  service:string = 'Dashboard';


  constructor(private http:HttpClient, private cookieService: CookieService) { }


  GetIndicadores(periodo?:string):Observable<GetColaboradoresModel>{
    let params = new HttpParams();
    
    if (periodo) {
        params = params.set('Periodo', periodo);
      }

    return this.http.get<GetColaboradoresModel>(`${environment.apiBaseUrl}/api/${this.service}/obtener-indicadores`,{params});
  }

  GetGraficaTipoServicios(periodo?:string):Observable<GetColaboradoresModel>{
    let params = new HttpParams();
    
    if (periodo) {
        params = params.set('Periodo', periodo);
      }

    return this.http.get<GetColaboradoresModel>(`${environment.apiBaseUrl}/api/${this.service}/obtener-grafica-tipo-servicios`,{params});
  }

  GetGraficaPagos(periodo?:string):Observable<GetColaboradoresModel>{
    let params = new HttpParams();
    
    if (periodo) {
        params = params.set('Periodo', periodo);
      }

    return this.http.get<GetColaboradoresModel>(`${environment.apiBaseUrl}/api/${this.service}/obtener-grafica-pagos`,{params});
  }

  GetGuardiasProximas():Observable<GetColaboradoresModel>{
    let params = new HttpParams();

    return this.http.get<GetColaboradoresModel>(`${environment.apiBaseUrl}/api/${this.service}/obtener-guardias-proximas`,{params});
  }

  GetGraficaIngresos():Observable<GetColaboradoresModel>{
    let params = new HttpParams();

    return this.http.get<GetColaboradoresModel>(`${environment.apiBaseUrl}/api/${this.service}/obtener-grafica-ingresos`,{params});
  }
}