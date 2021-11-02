import { Component, OnInit , Output , EventEmitter , Input  , OnChanges , SimpleChanges  } from '@angular/core';
import { FormGroup , FormBuilder , Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as M from "materialize-css";
import * as $ from "jquery";
import { LocationService } from "../../services/location.service";
import { TokenService } from "../../services/token.service";
import { OtpService } from "../../services/otp.service";
import { io } from "socket.io-client";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit , OnChanges  {

  clear                           = "dont_clear";

  area                            : string;

  location:string                 = "";

  @Input() Explore                = false;

  @Input() user_cart              : any;

  @Output() messsageEvent         = new EventEmitter<string>();

  @Output() LoggedUserEvent       = new EventEmitter<string>();

  @Output() User_Cart_Event       = new EventEmitter<string>();

  @Output() SearchBarClickEvent   = new EventEmitter<string>();

  userCartLength                  = 0;

  userCart                        : any;

  grandTotal                      = 0;

  sidenav_instance                : any;

  LoggedUser                     : any;

  GrandTotal                     : Number;

  Profile_Changer                : any;

  ComputerUserTyping             = false;

  MobileUserTyping               = false;

  SearchResult                   = [];

  socket                         : any;
 

  constructor(
    private fb      : FormBuilder,
    private router  : Router, 
    private locationService : LocationService,
    private tokenService    : TokenService,
    private otpservice      : OtpService
  ) {

    // this.socket = io('http://localhost:3000',{
    //   withCredentials: true,
    //   extraHeaders: {
    //   "my-custom-header": "abcd"
    //   }
    // });

    this.socket = io(environment.BASEURL);


  }

  ngOnInit(): void {
    this.initializeLocation(); 
    this.dropdown();
    this.sidenav();
    this.modal(); 
    this.location_selection();
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
    // this.navbarAnimation();


    // this.socket.on('message_received', data =>{
      
    // });
    if(this.tokenService.GetUserPayload()){
      this.Creatsocketroom();
    }

  }

  ngOnChanges(changes:SimpleChanges) : void{
    if(!this.Explore){
      if(!!this.user_cart.Cart == true)
      {
        this.userCart = this.user_cart;
        this.userCartLength = this.userCart.Cart.length;
        this.CalculateGrandTotal();
        this.User_Cart_Event.emit(this.userCart);
      }
    }
  }

  initializeLocation(){
    this.tokenService.GetLocation() ? this.area = this.tokenService.GetLocation() : this.area = "Chennai";
    document.querySelectorAll(".area")[0].textContent = " " + this.area; 
    document.querySelectorAll(".area")[1].textContent = " " + this.area; 
    this.LoggedUser = this.tokenService.GetUserPayload();
    this.LoggedUserEvent.emit(this.LoggedUser);
    setTimeout(()=>{
      this.Create_User_Cart();
    },2000);
  }

  logged_user(event){
    this.initializeLocation();
    this.Creatsocketroom();
  }


  Creatsocketroom(){
    this.socket.emit("create_room" , {
      room : this.tokenService.GetUserPayload()._id
    });
  }

  Create_User_Cart(){
    if(this.LoggedUser){
      return this.otpservice.GetUserCart().subscribe(data => {
        data.Present_Cart ? this.userCart  = data.Present_Cart : this.userCart = [];
        this.userCart.Cart ? this.userCartLength = this.userCart.Cart.length : this.userCartLength = 0;
        this.dropdown();
        this.CalculateGrandTotal();
        this.User_Cart_Event.emit(this.userCart);
      });
    }
  }

  // navbarAnimation(){
  //   window.addEventListener("scroll", function(){
  //     var $nav = $("#mainNavbar");
  //     $nav.toggleClass("position_fixed", $(this).scrollTop() > $nav.height());
  //   });
  // }

  dropdown(){
    var dropdown = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdown, {
      inDuration : 500,
      alignment : "right",
      coverTrigger : false,
      closeOnClick : false
    });
  }

  sidenav(){
    var sidenav = document.querySelector('.sidenav');
    this.sidenav_instance  = M.Sidenav.getInstance(sidenav);
    M.Sidenav.init(sidenav, {
      draggable : true,
      inDuration : 500
    });
  }

  modal(){
    var modal = document.querySelectorAll('.modal');
    M.Modal.init(modal, {
      dismissible : false
    });
    var tabs = document.querySelectorAll('.tabs');
    M.Tabs.init(tabs, {});
    $(".indicator").css({"background-color" :  "#00c853"})
  }

  Rest(){
    this.clear = "";
  }

  CancelClear(){
    this.clear = "dont_clear"
  }

  location_selection(){
    let num_areas   = document.querySelectorAll(".area_loc").length;
    for(let i=0 ; i< num_areas ; i++){
      document.querySelectorAll(".area_loc")[i].addEventListener("click",()=>{
        this.sendLocation(document.querySelectorAll(".area_loc")[i].textContent);
        document.querySelectorAll(".area")[0].textContent = " " + document.querySelectorAll(".area_loc")[i].textContent;
        document.querySelectorAll(".area")[1].textContent = " " + document.querySelectorAll(".area_loc")[i].textContent;
      })
    }
  };

  sendLocation(location){
    this.tokenService.DeleteLocation();
    this.tokenService.SetLocation(location);
    if(!this.Explore){
      this.router.navigate([""]);
    }
    this.messsageEvent.emit(location);
  }

  delete(item){
    this.locationService.RemoveFromCart(item._id).subscribe(data => {
      this.userCart = data.Present_Cart;
      this.userCartLength = this.userCart.Cart.length;
      this.CalculateGrandTotal();
      this.User_Cart_Event.emit(this.userCart)
    })
  }
  
  CartPage(){
    this.router.navigate(["cartpage"]);
  }

  NavigateToProfilePage(){
    this.router.navigate(["myprofile"]);
  }

  CalculateGrandTotal(){
    let total = 0;
    if(!!this.userCart.Cart == true){
      for(let i of this.userCart.Cart){
        total += (i.Quantity * i.Vegitable.actualPrice);
      }
      this.grandTotal = total;
    }
  }

  NavigateToHomePage(){
    this.router.navigate([""]);
  }

  search(event = ""){
    // console.log(event , this.area)
    this.MobileUserTyping = false;
    setTimeout(() => {
      if($("#search").val() != ""){
        this.locationService.SearchVegitables($("#search").val() , this.area).subscribe(data => {
          if(data.length > 0){
            this.ComputerUserTyping = true;
            this.SearchResult = data;
          }else{
            this.ComputerUserTyping  = false;
          }
        });
      }else{
        this.SearchResult = [];
        this.ComputerUserTyping  = false;
      }
    },100);
  };

  MobileSearch(event){
    // console.log(event , this.area)
    this.ComputerUserTyping = false;
    setTimeout(() => {
      if($(".mobilesearch").val() != ""){
        this.locationService.SearchVegitables($(".mobilesearch").val() , this.area).subscribe(data => {
          if(data.length > 0){
            this.MobileUserTyping = true;
            this.SearchResult = data;
          }else{
            this.MobileUserTyping  = false;
          }
        });
      }else{
        this.SearchResult = [];
        this.MobileUserTyping  = false;
      }
    },100);
  }

  ShowPage(id){
    var sidenav = document.querySelector('.sidenav');
    var sidenav_instance  = M.Sidenav.getInstance(sidenav);
    sidenav_instance.close();
    $("#search").val("");
    this.search();
    this.router.navigate(["product" , id]);
    this.SearchBarClickEvent.emit(id);
   }

  logout(){
    this.tokenService.DeleteUserToken();
    this.initializeLocation();
    this.router.navigate([""]);
  }

  SellproductPage(){
    this.router.navigate(["Farm2backSellProduct"]);
  }

  ExplorePage(){
    this.router.navigate(["explore"]);
  }

  ChatbotPage(){
    this.router.navigate(["contactfarm2bagteam"]);
  }


}
