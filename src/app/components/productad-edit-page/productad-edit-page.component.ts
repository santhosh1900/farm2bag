import { Component, OnInit } from '@angular/core';
import { AduploadService } from "../../services/adupload.service";
import { FormGroup , FormBuilder , Validator, Validators } from '@angular/forms';
import * as $ from "jquery";
import * as M from "materialize-css";

import { Router } from '@angular/router';
import { TokenService } from "../../services/token.service";

@Component({
  selector: 'app-productad-edit-page',
  templateUrl: './productad-edit-page.component.html',
  styleUrls: ['./productad-edit-page.component.css']
})
export class ProductadEditPageComponent implements OnInit {


  PosterData      : any;
  ProffData       : any;
  VideoData       : any;
  Loader          = true;
  AdInfo          : any;
  AddressInfo     : any;
  ProductForm     : FormGroup;
  Username        = this.tokenservice.GetUserPayload().Username;  
  Submit          = false;
  sync            = this.tokenservice.cloudinary();  
  ImageUrl        = "";
  ImageId         = "";     
  ProffUrl        = "";
  ProffId         = "";
  VideoUrl        = "";
  VideoId         = "";
  VideoUploaded   = false;
  PosterUploaded  = false;
  ProffUploaded   = false;
  btnclicked      = false;

  constructor(
    private Adservice     : AduploadService,
    private fb            : FormBuilder,
    private tokenservice  : TokenService,
    private router        : Router, 

  ) { }

  ngOnInit(): void {
    this.GetUserAd();

  }


  GetUserAd(){
    this.Adservice.GetWholesaleAd().subscribe(data => {
      // console.log(data);
      this.AdInfo  = data;
      this.AddressInfo = data.Address;
      console.log(this.AdInfo)
      console.log(this.AddressInfo)
      this.Loader = false;
      this.FormInit();
    })
  }

  FormInit(){
    this.ProductForm = this.fb.group({
      Username    : [ this.Username , Validators.required ],
      Name        : [ this.AdInfo.Name , Validators.required ],
      Line1       : [ this.AddressInfo.Line1 , Validators.required ],
      Line2       : [ this.AddressInfo.Line2 , Validators.required ],
      Area        : [ this.AddressInfo.Area , Validators.required ],
      State       : [ this.AddressInfo.State , Validators.required ],
      Pincode     : [ this.AddressInfo.Pincode , Validators.required ],
      Landmark    : [ this.AddressInfo.Landmark , Validators.required ],
      ProductDesc : [ this.AdInfo.ProductDescription , Validators.required ],
      City        : [ this.AdInfo.City , Validators.required ]
    });
  }

  ChangePosterImage(event){
    this.PosterData = event.target.files[0];
    if(this.PosterData && this.PosterData.size > 16006931){
      this.toast("Your file is too large it must be less than 15mb" , "#e53935 red darken-1");
      this.PosterData    = "";
      return $(".poster__input").val("");
    }else{
      $('#poster__image').attr('src', window.URL.createObjectURL(event.target.files[0]));
    }
  };

  UploadPosterImage(){
    this.toast("Uploading Image");
    this.btnclicked = true;
    const data = new FormData();
    data.append("file",this.PosterData);
    data.append("upload_preset", this.sync.projectname);
    data.append("cloud_name", this.sync.profilename);
    // we must add /image/upload at the end of this url
    fetch(`https://api.cloudinary.com/v1_1/${this.sync.profilename}/image/upload`,{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
      this.UploadPosterToBackend(data.public_id , data.url);
    })
    .catch((err)=>{
      this.Loader = false;
      this.btnclicked = false;
      this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
    });
  };

  UploadPosterToBackend(ImageId , ImageUrl){
    this.Adservice.UpdateWholesaleAdPoster(ImageId , ImageUrl).subscribe(data => {
      this.PosterData = "";
      this.toast("Poster Is Updated");
      this.btnclicked = false;
    },err => {
      this.toast("Unkown Error Occured");
      this.btnclicked = false;
    })
  };

  ChangeProffImage(event){
    this.ProffData = event.target.files[0];
    if(this.ProffData && this.ProffData.size > 16006931){
      this.toast("Your file is too large it must be less than 15mb" , "#e53935 red darken-1");
      this.ProffData    = "";
      return $(".proff__input").val("");
    }else{
      $('#proff__image').attr('src', window.URL.createObjectURL(event.target.files[0]));
    }
  };

  UploadProffImage(){
    this.toast("Uploading Image");
    this.btnclicked = true;
    const data = new FormData();
    data.append("file",this.ProffData);
    data.append("upload_preset", this.sync.projectname);
    data.append("cloud_name", this.sync.profilename);
    // we must add /image/upload at the end of this url
    fetch(`https://api.cloudinary.com/v1_1/${this.sync.profilename}/image/upload`,{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
      this.UploadProffToBackend(data.public_id , data.url);
    })
    .catch((err)=>{
      this.Loader = false;
      this.btnclicked = false;
      this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
    });
  };

  UploadProffToBackend(ImageId , ImageUrl){
    this.Adservice.UpdateWholesaleAdProff(ImageId , ImageUrl).subscribe(data=>{
      this.ProffData = "";
      this.toast("Address Proff Is Updated");
      this.btnclicked = false;
    },err => {
      this.toast("Unkown Error Occured");
      this.btnclicked = false;
    })
  }

  ChangeVideo(event){
    this.VideoData = event.target.files[0];
    if(this.VideoData && this.VideoData.size > 16006931){
      this.toast("Your file is too large it must be less than 15mb" , "#e53935 red darken-1");
      this.VideoData    = "";
      return $(".video__input").val("");
    }else{
      $('#video_').attr('src', window.URL.createObjectURL(event.target.files[0]));
    }
  }

  
  UploadVideo(){
    this.toast("Uploading Video");
    this.btnclicked = true;
    const data = new FormData();
    data.append("file" ,this.VideoData,);
    data.append("upload_preset", this.sync.projectname);
    data.append("cloud_name", this.sync.profilename);
    // we must add /image/upload at the end of this url
    fetch(`https://api.cloudinary.com/v1_1/${this.sync.profilename}/video/upload`,{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
      this.UploadVideoToBackend(data.public_id , data.url);
    })
    .catch((err)=>{
      this.Loader = false;
      this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
    });
  };


  UploadVideoToBackend(VideoId , VideoUrl){
    this.Adservice.UpdateWholesaleAdVideo(VideoId , VideoUrl).subscribe(data => {
      this.VideoData = "";
      this.toast("Video Is Updated");
      this.btnclicked = false;
    },err => {
      this.toast("Unkown Error Occured");
      this.btnclicked = false;
    })
  }

  SubmitProductEditForm(){
    this.Adservice.UpdateWholesaleAd(this.ProductForm.value).subscribe(data => {
      this.toast("Your Ad is Updated");
      this.router.navigate(["Farm2backSellProduct"]);
    })
  }

  toast(text , classes="#43a047 green darken-1"){
    M.toast({html: text , classes : classes})
  };

  Allowsubmit(){
    this.Submit = true;
  }







}
