import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const BASEURL = environment.BASEURL;

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http : HttpClient) { }

  GetAllOrders():Observable<any>{
    return this.http.get(`${BASEURL}/allorders`);
  }
}
