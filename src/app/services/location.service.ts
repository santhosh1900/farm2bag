import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const BASEURL = environment.BASEURL;

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http : HttpClient) {}


  SubmitLocation( Longitude = 0 , Latitude = 0) : Observable<any>{
    return this.http.put(`${BASEURL}/submitlocation`,{
      Longitude,
      Latitude
    })
  };

  GetAllVeges(location): Observable<any> {
    return this.http.get(`${BASEURL}/allveges?location=${location}`);
  }

  AddToCart(id):Observable<any> {
    return this.http.post(`${BASEURL}/addtocart`,{
      id
    });
  };

  RemoveFromCart(item_id = ""):Observable<any> {
    return this.http.post(`${BASEURL}/removefromcart`,{
      item_id
    });
  };

  EditCartItemQuantity(item_id , quantity){
    return this.http.put(`${BASEURL}/productedit`,{
      item_id,
      quantity
    });
  }

  GetInfo(id):Observable<any>{
    return this.http.get(`${BASEURL}/productInfo/${id}`);
  };

  SearchVegitables(query , locationName):Observable<any>{
    return this.http.post(`${BASEURL}/search-veges`,{
      query,
      locationName
    })
  }

  
}
