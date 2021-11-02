import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const BASEURL = environment.BASEURL;

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  constructor(private http : HttpClient) {}

  SendOtp(mobilenumber):Observable<any> {
    return this.http.post(`${BASEURL}/sendotp`,{
      mobilenumber : mobilenumber,
    });
  };

  EditOTPNumebr(mobilenumber , previousnumber):Observable<any> {
    return this.http.post(`${BASEURL}/EditNumber` , {
      mobilenumber : mobilenumber,
      PreviousNumber : previousnumber
    })
  };

  VerifyOTP(mobilenumber , otp):Observable<any> {
    return this.http.post(`${BASEURL}/verifyotp`,{
      otp,
      mobilenumber,
    });
  };

  RegisterUser(username , password , phone):Observable<any>{
    return this.http.post(`${BASEURL}/registeruser` , {
      username,
      password,
      phone
    })
  };

  LoginUser(phone , password):Observable<any>{
    return this.http.post(`${BASEURL}/login` , {
      phone,
      password
    })
  };

  FortgetPasswordOtpRequest(phoneNumer):Observable<any>{
    return this.http.post(`${BASEURL}/forgotpasswordotpgenerate` , {
      phoneNumer
    });
  };

  SubmitFortgetPasswordOtp(phoneNumer , otp):Observable<any>{
    return this.http.post(`${BASEURL}/submitforgotpasswordotp` , {
      phoneNumer,
      otp
    });
  };

  ChangePassword(phoneNumer , otp , password):Observable<any>{
    return this.http.post(`${BASEURL}/changepassword`,{
      phoneNumer,
      otp,
      password
    });
  };

  GetUserCart():Observable<any>{
    return this.http.get(`${BASEURL}/usercart`);
  };

  GetUserInfo():Observable<any>{
    return this.http.get(`${BASEURL}/userinfo`)
  };

  EditUserInfo(body):Observable<any>{
    return this.http.put(`${BASEURL}/edituserinfo`,{
      body
    });
  }

  RequestMobileNumberChange(number):Observable<any>{
    return this.http.post(`${BASEURL}/edituserphone`,{
      number
    });
  }

  ChangeUserPhoneNumber(number, otp):Observable<any>{
    return this.http.put(`${BASEURL}/changephonenumber`,{
      number,
      otp
    });
  };

  SubmitAddress(body):Observable<any>{
    return this.http.post(`${BASEURL}/submitaddress`,{
      body
    });
  };

  EditAdress(addressId ,body):Observable<any>{
    return this.http.put(`${BASEURL}/editadress`,{
      addressId,
      body
    });
  };

  DeleteAdress(addressId , id):Observable<any>{
    return this.http.delete(`${BASEURL}/deleteaddress/${addressId}/${id}`);
  };

  PurchaseCart(grandTotal , addressId):Observable<any>{
    return this.http.post(`${BASEURL}/cartpurchased`,{
      grandTotal,
      addressId
    });
  };

  GetPreviousCart():Observable<any>{
    return this.http.get(`${BASEURL}/previouscart`);
  }

  UpdateDP(ImgId , ImgUrl):Observable<any>{
    return this.http.put(`${BASEURL}/updatedp`,{
      ImgId,
      ImgUrl
    })
  };


  GetUserById(id):Observable<any>{
    return this.http.get(`${BASEURL}/getuserbyid/${id}`)
  }

  // /edituserphone
  
}
