import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TipoLugarService {

  service:string = 'TipoLugar';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Get():Observable<any>{
   
    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}`);
  }

  

}