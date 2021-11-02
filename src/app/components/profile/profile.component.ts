import { Component, OnInit } from '@angular/core';
import { event } from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  LoggedUser  : any;

  AllowProfileView = true;

  AllowReviewView = false;

  AllowUserPreviousCart = false;

  constructor() { }

  ngOnInit(): void {
  }

  logged_user(event){
    this.LoggedUser = event;
  }

  AllowProfile(){
    this.AllowProfileView = true;
    this.AllowReviewView = false;
    this.AllowUserPreviousCart  = false;
  }
  AllowReview(){
    this.AllowProfileView = false;
    this.AllowReviewView  = true;
    this.AllowUserPreviousCart  = false;
  }

  AllowPreviousCart(){
    this.AllowProfileView       = false;
    this.AllowReviewView        = false;
    this.AllowUserPreviousCart  = true;
  }

}
