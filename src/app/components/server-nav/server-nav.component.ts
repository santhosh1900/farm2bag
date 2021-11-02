import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css";
import { TokenService } from "../../services/token.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-server-nav',
  templateUrl: './server-nav.component.html',
  styleUrls: ['./server-nav.component.css']
})
export class ServerNavComponent implements OnInit {

  LoggedUser : any;


  constructor(
    private tokenService : TokenService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.LoggedUser = this.tokenService.GetUserPayload();
    console.log(this.LoggedUser);
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

}
