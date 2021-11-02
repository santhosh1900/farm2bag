import { Component, OnInit } from '@angular/core';
import { TokenService } from "../../services/token.service";
import { OtpService } from "../../services/otp.service";
import * as moment from "moment";

@Component({
  selector: 'app-previous-cart',
  templateUrl: './previous-cart.component.html',
  styleUrls: ['./previous-cart.component.css']
})
export class PreviousCartComponent implements OnInit {
  loggedUser    : any;
  PreviousCarts : any;
  Loader        = true;

  constructor(
    private tokenService    : TokenService,
    private otpService  : OtpService
  ) { }
  

  ngOnInit(): void {
    this.GetCurrentUser();
  }

  GetCurrentUser(){
    this.loggedUser = this.tokenService.GetUserPayload();
    // console.log(this.loggedUser);
    this.otpService.GetPreviousCart().subscribe(data => {
      this.PreviousCarts = data.Prevoius_Carts;
      this.Loader = false;
      console.log(this.PreviousCarts);
    });
  };
  
  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  MoreDetails(item){
    console.log(item)
  }

  CancelOrder(item){
    console.log(item)
  }



}
