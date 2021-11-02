import { Component, OnInit , AfterViewInit } from '@angular/core';
import * as M from "materialize-css";
import { Router } from '@angular/router';
import { LocationService } from "../../services/location.service";
import { OtpService } from "../../services/otp.service";
import { TokenService } from "../../services/token.service";
import * as $ from "jquery";
import * as _ from "lodash";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit , AfterViewInit {


  LoggedUser          : any;
  Address_List        : any;
  cart_icon1          : any;
  cart_icon2          : any;
  Loader              = true;
  UserCart_Loader     = true;
  UsercartInfo        : any;
  Usercart            : any;
  grandTotal          : number;
  Total               : number;
  DeliveryDate        : string;
  SelectedAddress     : any;
  Correct_Address     = false;

  constructor(
    private otpService  : OtpService,
    private router      : Router,

  ) { }



  ngOnInit(): void {
    this.CalculateTodayDate();
  }

  ngAfterViewInit(){
    this.cart_icon1 = document.querySelector("#user__cart1");
    this.cart_icon2 = document.querySelector("#user__cart2");
    this.cart_icon1.style.display = "none";
    this.cart_icon2.style.display = "none";
  }

  User_Cart_Event_Catch(event){
    this.UsercartInfo     = event;
    this.Usercart         = event.Cart;
    this.UserCart_Loader  = false;
    if(!this.Usercart){
      this.Usercart = [];
      this.toast("You Haven't Purchased Anything" , "#ef5350 red lighten-1")
      return this.router.navigate([""]);
    }
    this.CalculateGrandtotal();
  };

  Logged_User(event){
    this.LoggedUser = event;
    this.GetUserInfo();
  }

  GetUserInfo(){
    this.otpService.GetUserInfo().subscribe(data => {
      this.Address_List = data.CurrentUser.Adderss;
      this.Loader = false;
    });
  };

  NavigateToAddressForm(){
    this.router.navigate(["addressform"]);
  }

  CalculateGrandtotal(){
    let total = 0;
    for(let i of this.Usercart){
      total += (i.Quantity * i.Vegitable.actualPrice);
    }
    this.Total = total;
    this.grandTotal = this.Total + 65;
  }

  CalculateTodayDate(){
    var today               = new Date();
    var next_week           = new Date(today);
    next_week.setDate(today.getDate() + 7);
    var dd                  = String(next_week.getDate()).padStart(2, '0');
    var mm                  = String(next_week.getMonth() + 1).padStart(2, '0');
    var yyyy                = next_week.getFullYear();
    this.DeliveryDate       = dd + '/' + mm + '/' + yyyy;
  }

  PlaceOrder(){
    if(!!this.SelectedAddress == false){
      return this.toast("Please Select Delivery Address" , "#f57f17 yellow darken-4");
    }
    this.otpService.PurchaseCart(this.grandTotal , this.SelectedAddress.User_Address._id).subscribe(data => {
      this.toast("Your Order Is Placed");
      this.router.navigate([""]);
    },err => {
      this.toast("Oops Something Went Wrong" , "#ef5350 red lighten-1");
    });
  }

  SelectAddress(address){
    this.SelectedAddress = address;
    if(this.SelectedAddress.User_Address.City.toUpperCase() == this.Usercart[0].Vegitable.location_name.toUpperCase()){
      return this.Correct_Address = true;
    }
    this.toast("Please Select The Vegitables From The Farms Nearer To Your Location","#ef5350 red lighten-1");
    return this.Correct_Address = false;
  }

  toast(text , classes = "#43a047 green darken-1"){
    M.toast({html: text , classes })
  }

}
