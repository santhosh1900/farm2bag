import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css";
import { TokenService } from "../../services/token.service";
import { Router } from '@angular/router';
import * as $ from "jquery";
import { ServerService } from "../../services/server.service";

@Component({
  selector: 'app-server-side',
  templateUrl: './server-side.component.html',
  styleUrls: ['./server-side.component.css']
})
export class ServerSideComponent implements OnInit {

  LoggedUser : any;

  constructor(
    private router : Router,
    private Tokenservoice : TokenService,
    private ServerSideRequest : ServerService
  ) { }

  ngOnInit(): void {

    this.LoggedUser = this.Tokenservoice.GetUserPayload();
    $("html").css({ "min-width" : "1000px"});
    this.GetAllOrders();
    
  }

  checkAdminorNot(){
    if(this.LoggedUser.Admin){
      return true;
    }
    return this.router.navigate([""]);
  };

  GetAllOrders(){
    this.ServerSideRequest.GetAllOrders().subscribe(data => {
      console.log(data)
    })
  }

}
