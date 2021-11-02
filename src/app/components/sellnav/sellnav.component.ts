import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css";
import { TokenService } from "../../services/token.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sellnav',
  templateUrl: './sellnav.component.html',
  styleUrls: ['./sellnav.component.css']
})
export class SellnavComponent implements OnInit {

  LoggedUser : any;


  constructor(
    private tokenService : TokenService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.LoggedUser = this.tokenService.GetUserPayload();
    this.dropdown();
  }


  dropdown(){
    setTimeout(()=>{
      var dropdown = document.querySelectorAll('.dropdown-trigger');
      M.Dropdown.init(dropdown, {
        inDuration : 500,
        alignment : "right",
        coverTrigger : false,
        closeOnClick : false
      });
      this.sidenav();
    },2000);
  }

  sidenav(){
    var sidenav = document.querySelector('.sidenav');
    var sidenav_instance  = M.Sidenav.getInstance(sidenav);
    M.Sidenav.init(sidenav, {
      draggable : true,
      inDuration : 500
    });
  }


  logout(){
    this.tokenService.DeleteUserToken();
    this.router.navigate([""]);
    
  }

  NavigateToSellerpoint(){
    this.router.navigate(["Farm2backSellProduct"])
  }

  homepage(){
    this.router.navigate([""]);
  }

  NavigateToProfilePage(){
    this.router.navigate(["myprofile"]);
  }

  ExplorePage(){
    this.router.navigate(["explore"]);
  }

}
