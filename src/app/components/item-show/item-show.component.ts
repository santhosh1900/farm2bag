import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from "../../services/location.service";
import { TokenService } from "../../services/token.service";
import * as M from "materialize-css";
import * as $ from "jquery";
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-show',
  templateUrl: './item-show.component.html',
  styleUrls: ['./item-show.component.css']
})
export class ItemShowComponent implements OnInit{

  productId           : any;
  Product             : any;
  isDown              = false;
  startX              = 0;
  ScrollLeft          = 0;
  slider              : any;
  btn_slider          : any;
  allProducts         : any;
  userCart            = [];
  newItem             : any;
  item_present        = false;
  userCartLength      : Number;
  random              : any;
  loader              = false;
  LoggedUser          : any;
  AddToCartPermission = true;
  User_Cart_Restriction = [];

  constructor(private route : ActivatedRoute,
              private locationService : LocationService,
              private router : Router,
              private tokenService : TokenService) { }

  ngOnInit(): void {
    localStorage.getItem("CartArray") ? this.userCart = JSON.parse(localStorage.getItem("CartArray")) : this.userCart = [];
    this.GetInfo();
  }

  GetInfo(){
    this.loader = true;
    this.LoggedUser = this.tokenService.GetUserPayload();
    setTimeout(()=>{
      this.productId = this.route.snapshot.paramMap.get("id");
      this.locationService.GetInfo(this.productId).subscribe(async data => {
        this.Product = data.product;
        this.allProducts = [];
        this.allProducts = data.allProducts;
        this.loader = false;
        setTimeout(()=>{
          this.timeOutFunction(data);
          this.checker();
        },700)
      });
    },2000)   
  }

  alignDescription(desc){
    var description = desc.split(".")
    description.pop();
    for(let i = 0 ; i < description.length ; i++){
      document.querySelector("#product_desc").innerHTML += `<li class="collection-item">${ description[i] }</li>`
    }
  }

  checker(){
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let number_of_elements    = document.querySelectorAll('.arrows').length;
    let number_slide_elements = document.querySelectorAll(".slide__in").length;
    let number_of_eye         = document.querySelectorAll(".fa-eye").length;
		if(!isMobile){
      $("#show__item").css({
        minWidth: "500px"
      });

      $("nav").css({
        minWidth: "500px"
      });
    }
    else
    {
      for(let i = 0 ; i < number_of_elements ; i++){
        document.querySelectorAll('.arrows')[i].classList.add("arrows__hidden");
      }
      for(let y = 0 ; y < number_slide_elements ; y++){
        document.querySelectorAll('.slide__in')[y].classList.add("arrows__hidden");
      }
      for(let z = 0 ; z < number_of_eye ; z++){
        document.querySelectorAll('.fa-eye')[z].classList.add("arrows__hidden");
      }
    }
  }

  Logged_User(event){
    this.LoggedUser = event;
  }


  timeOutFunction(data : any){
    var infoImage = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(infoImage, {});
    this.alignDescription(data.product.description);
    const tabs2 = document.querySelector(".tabs2");
    M.Tabs.init(tabs2 , {});
    $(".indicator").css({"background-color" :  "#00c853"});
  }


  pushLeft(event){
    for(let i of event.path)
    {
      if(i.className + "" == "horizontal__slide" )
      {
        this.btn_slider = i.childNodes[1];
      }
    }
    this.btn_slider.classList.add("scrolling");
    let scrollIndex = this.btn_slider.scrollLeft;
		let value1 = scrollIndex + 400;
    this.btn_slider.scrollLeft = value1;
    this.btn_slider.classList.remove("scrolling");
  }

  pushRight(event){
    for(let i of event.path)
    {
      if(i.className + "" == "horizontal__slide" )
      {
        this.btn_slider = i.childNodes[1];
      }
    }
    this.btn_slider.classList.add("scrolling");
    let scrollIndex = this.btn_slider.scrollLeft;
		let value2 = scrollIndex - 400;
    this.btn_slider.scrollLeft = value2;
    this.btn_slider.classList.remove("scrolling");
  }

  mouseDown(event){
    for(let i of event.path){
     if(i.className + "" == "market__items" ){
       this.slider = i;
      }
    }
     this.slider.classList.add("grabbed");
     this.isDown = true;
     this.startX = event.pageX - this.slider.offsetLeft;
     this.ScrollLeft = this.slider.scrollLeft; 
   }
 
   mouseLeave(event){
     this.isDown = false;
     if(this.slider){
       this.slider.classList.remove("grabbed")
     }
   }
 
   mouseUp(event){
     this.isDown = false;
     if(this.slider){
       this.slider.classList.remove("grabbed")
     }
   }
 
   mousemove(event){
     if(!this.isDown) return;
     event.preventDefault();
     let x = event.pageX - this.slider.offsetLeft;
     const walk = (x - this.startX);
     this.slider.scrollLeft = this.ScrollLeft - walk;
   }


   info(vegetable){
    var string = (vegetable.description);
    var desc  = string.split(".")
    desc.pop()
    for(let i = document.getElementsByTagName("img").length - 1 ; i > 0 ; i-- ){
      if(document.getElementsByTagName("img")[i].id == "modal_img"){
          document.getElementsByTagName("img")[i].src = vegetable.image;
      }
    }
    document.querySelector("#product_title").textContent  = vegetable.name;
    document.querySelector("#modal_farm").textContent     = `Farm : ${vegetable.farm.name}`;    
    document.querySelector("#modal_weight").textContent   = `Weight : ${vegetable.weight || "500g"}`;
    document.querySelector("#modal_MRP").textContent      = `MRP : ₹ ${vegetable.actualPrice}`;
    for(let i=0 ; i < desc.length ; i++){
      document.querySelector("#productDesc2").innerHTML   += `<li class="collection-item">${ desc[i] }</li> `
    }

    if(vegetable.quantity == 0){
      document.querySelector("#moda_cart").innerHTML = "Out Of Stock";
    }else{
      document.querySelector("#moda_cart").innerHTML = `<i class="fa fa-shopping-cart fa-2x" id="modal_cart_icon" aria-hidden="true" style="color:#2e7d32;cursor: pointer;"></i>`;
      this.modal_click();
    }

  }

  modal_click(){
    document.querySelector("#modal_cart_icon").addEventListener("click", ()=>{
      var farm__name = document.querySelector("#modal_farm").textContent.split(": ")[1];
      this.allProducts.forEach((vege)=>{
        if((vege.name ==  document.querySelector("#product_title").textContent) && (vege.farm.name == farm__name)){
          this.AddToCart(vege);
          return
        }
      });
    })
  }

  resetmodel(){
    document.querySelector("#productDesc2").innerHTML = ""
  }

  User_Cart_Event_Catch(event){
    this.User_Cart_Restriction = event.Cart; 
  }
  
  AddToCart(vegitable){
    let logged_user = this.tokenService.GetUserPayload();
    logged_user ? this.AddToCartService(vegitable) : this.toast("Please Login For Adding Vegitable" , "#c0ca33 lime darken-1");
  }

  AddToCartService(vegitable){
    var allow_to_add = this.User_Cart_Restriction_Policy(vegitable)
    if(allow_to_add && this.AddToCartPermission){
      this.AddToCartPermission = false;
      this.locationService.AddToCart(vegitable._id).subscribe(data =>{
        this.userCart = data.Present_Cart;
        this.toast(data.message);
        this.AddToCartPermission = true; 
      },err=>{
        this.AddToCartPermission = true; 
        this.toast(err.error.message , "#e53935 red darken-1");
      });
    }
  };

  User_Cart_Restriction_Policy(item : any){
    if(!!this.User_Cart_Restriction == true && this.User_Cart_Restriction.length > 0 ){
      if(this.User_Cart_Restriction[0].Vegitable.farm != item.farm._id){
        this.toast("You Cannot Add Product From Different Farms or Location" , "#e53935 red darken-1");
        return false;
      }
      for(let i of this.User_Cart_Restriction){
        if(i.Vegitable._id + "" == item._id + ""){
          if(i.Quantity >= 5){
            this.toast("You Cannot Add Same Product More Than 5 Times" , "#e53935 red darken-1");
            return false;
          }
        }
      }
      return true;
    }else{
      return true;
    }
  };

  ShowPage(id){
    if(this.productId != id ){
      this.router.navigate(["product" , id]);
      document.querySelector("#product_desc").innerHTML = "";
      this.GetInfo();
    }
  };

  GotoNextPage(event){
    this.ShowPage(event);
  };

  toast(text , classes = "#43a047 green darken-1"){
    this.random = Math.random();
    M.toast({html: text , classes :classes});
  }

}
