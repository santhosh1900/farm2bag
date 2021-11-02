import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService : CookieService) { }

  SetLocation(token) {
    return this.cookieService.set("Current_Location" , token)
  }

  GetLocation(){
    return this.cookieService.get("Current_Location");
  }

  DeleteLocation(){
    return this.cookieService.delete("Current_Location");
  }

  SetUserInfo(token){
    return this.cookieService.set("User_token" , token)
  }

  GetUserToken() {
    return this.cookieService.get("User_token");
  }

  DeleteUserToken(){
    return this.cookieService.delete("User_token");
  }

  GetUserPayload(){
    const token = this.GetUserToken();
    let payload;
    if(token) {
      payload = token.split(".")[1];
      payload = JSON.parse(window.atob(payload));
      return payload.data;
    }
    return "";    
  }

  cloudinary(){
    var data = {
      projectname : "vishvakarma",
      profilename : "dahmo2frl",
      cloud_name: 'dahmo2frl', 
      api_key: "137383149455181", 
      api_secret: "rHS5rlkDIDUVRhIbZSX5rUqMYp8"
    }
    return data;
  }

  mapbox(){
    var data = {
      api : 'pk.eyJ1Ijoic2FuZHkxNjkyMDAwIiwiYSI6ImNrOW51MXJzMjA0czEzbHBhZXR5dzF0NDUifQ.p7H76vCl2BgDcKwPyq9tgg',
    }
    return data;
  }


  NewLine(){
    var data = {
      newline :  "[N;l]"
    }
    return data;
  }

}
