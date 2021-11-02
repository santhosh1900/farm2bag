import { Component, OnInit , AfterViewInit } from '@angular/core';
import * as M from "materialize-css";
import { Router } from '@angular/router';
import { LocationService } from "../../services/location.service";
import { TokenService } from "../../services/token.service";
import * as $ from "jquery";
import * as _ from "lodash";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit  , AfterViewInit{
  
  UserCart        : any;
  LoggedUser      : any;
  loader          = true;
  cart_icon1      : any;
  cart_icon2      : any;
  modal           : any;
  instances       : any;
  going_to_delete : any;
  grandTotal      : Number;



  constructor(
    private router : Router, 
    private locationService  : LocationService,
    private tokenservice : TokenService
  ) { }

  ngOnInit(): void {
    this.modalInitialize();
  }

  ngAfterViewInit(){
    this.cart_icon1 = document.querySelector("#user__cart1");
    this.cart_icon2 = document.querySelector("#user__cart2");
    this.cart_icon1.style.display = "none";
    this.cart_icon2.style.display = "none";
  }

  User_Cart_Event_Catch(event){
    event.Cart ? this.loader = false : this.loader = true;
    event.Cart ? this.UserCart = event.Cart : this.UserCart = []; 
    if(this.UserCart.length > 0){
      this.quantityIndexNumber();
      this.calculateGrandTotal();
    }else{
      this.grandTotal = 0;
    }
  }

  Logged_User(event){
    this.LoggedUser = this.tokenservice.GetUserPayload();
  }

  ChangeQuantity(product){
    var quantity = $(`#${product._id}`).val();
    this.locationService.EditCartItemQuantity(product._id , quantity).subscribe(data =>{
      this.Update_the_UserCart(product._id , this.UserCart , quantity);
    },err=>{
      $(`#${product._id}`).val(`${product.Quantity}`).change();
      this.toast(err.error.message , "#b71c1c red darken-4")
    });
  }

  Update_the_UserCart(item_id : any , User_Cart : any , quantity){
    User_Cart.forEach(item => {
      if(item._id == item_id){
        item.Quantity = Number(quantity);
        this.toast("Item is Updated")
        return this.calculateGrandTotal();
      }
    })
  }

  hideusercart(){
    this.cart_icon1.style.display = "none";
    this.cart_icon2.style.display = "none";
  }

  modalInitialize(){
    this.modal = document.querySelector('.alert__modal');
    M.Modal.init(this.modal, {
      dismissible : true
    });
    this.instances = M.Modal.getInstance(this.modal);
  }

  deleteItemModal(item : any){
    this.going_to_delete = item;
    this.instances.open();
  }

  deleteItemFromCart(){
    this.locationService.RemoveFromCart(this.going_to_delete._id).subscribe(data => {
      this.UserCart = data.Present_Cart.Cart;
      this.calculateGrandTotal();
      this.quantityIndexNumber();
      this.modalClose();
    },err =>{
      this.toast("Unknown Error Occured" , "#e53935 red darken-1");
      this.modalClose();
    });
  }

  modalClose(){
    this.instances.close();
  }

  quantityIndexNumber(){
    setTimeout(()=>{
      var numbers = document.querySelectorAll(".Number");
      for(let i = 0 ; i < numbers.length ; i++){
        document.querySelectorAll(".Number")[i].textContent = `${i + 1}`
      }
    },300)
  }

  calculateGrandTotal(){
    let total = 0;
    for(let i of this.UserCart){
      total += (i.Quantity * i.Vegitable.actualPrice);
    }
    this.grandTotal = total;
  }

  navigateToHomepage(){
    this.router.navigate(["/"])
  }

  navigateToCheckout(){
    this.router.navigate(["/checkout"])
  }

  toast(text , classes = "#43a047 green darken-1"){
    M.toast({html: text , classes })
  }

}
