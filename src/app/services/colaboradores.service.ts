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
export class ColaboradoresService {

  service:string = 'Colaborador';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  EnviarDoccumentacion(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/${this.service}/AdjuntarDocumentacion`,formData);
  }

  GetColaboradores(request:any):Observable<any>{
    let params = new HttpParams();

    if (request.correoElectronico) {
      params = params.set('CorreoElectronico', request.correoElectronico);
    }
  
    if (request.nombre) {
      params = params.set('Nombre', request.nombre);
    }

    if (request.telefono) {
      params = params.set('Telefono', request.telefono);
    }

    if (request.tipo) {
      params = params.set('Tipo', request.tipo);
    }
    return this.http.get<any>(`${environment.apiBaseUrl}/${this.service}`,{params});
  }

  GetColaborador(colaboradorId:string):Observable<GetColaboradoresModel>{
    let params = new HttpParams();
    params = params.append('id', colaboradorId);

    return this.http.get<GetColaboradoresModel>(`${environment.apiBaseUrl}/${this.service}/GetColaborador`,{params});
  }

  Create(request:CreateColaboradorModel):Observable<CreateColaboradorModel>{
    return this.http.post<CreateColaboradorModel>(`${environment.apiBaseUrl}/${this.service}`,request);
  }

  Update(id:string, request:UpdateColaboradorModel):Observable<UpdateColaboradorModel>{
    return this.http.put<UpdateColaboradorModel>(`${environment.apiBaseUrl}/${this.service}/${id}`,request);
  }

  ActivarColaborador(id:any):Observable<any>{
    return this.http.put<any>(`${environment.apiBaseUrl}/${this.service}/${id}/ActivarColaborador`,{});
  }
}