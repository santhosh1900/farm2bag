import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.scrollerDisplay();
  }

  scrollerDisplay(){
    window.addEventListener("scroll", function(){
      if(window.scrollY == 0 || window.scrollY <= 250){
        $("#scroller_top").css({
          display : "none"
        });
      }else {
        $("#scroller_top").css({
          display : "block"
        });       
      }
    });
  }

  scrollTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
