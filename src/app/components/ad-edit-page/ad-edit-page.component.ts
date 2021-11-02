import { Component, OnInit } from '@angular/core';
import { AduploadService } from "../../services/adupload.service";
import { FormGroup , FormBuilder , FormControl , Validator, Validators } from '@angular/forms';
import * as $ from "jquery";
import * as M from "materialize-css"

import { Router } from '@angular/router';
import { TokenService } from "../../services/token.service";


@Component({
  selector: 'app-ad-edit-page',
  templateUrl: './ad-edit-page.component.html',
  styleUrls: ['./ad-edit-page.component.css']
})
export class AdEditPageComponent implements OnInit {

  Username            = this.tokenservice.GetUserPayload().Username; 
  FarmerProductForm   : FormGroup; 
  Ad                  : any;
  ImageData           : any;
  VideoData           : any;
  sync                = this.tokenservice.cloudinary(); 
  ImageUrl            = "";
  ImageId             = "";
  VideoUrl            = "";
  VideoId             = "";
  Loader              = true;
  AllowSubmit         = false;

  constructor(
    private adservice     : AduploadService,
    private fb            : FormBuilder,
    private router        : Router,
    private tokenservice  : TokenService

  ) { }

  ngOnInit(): void {

    this.GetuserAd();
  }


  FormInit(){
    this.FarmerProductForm = this.fb.group({
      Username    : new FormControl(this.Username, Validators.required),
      Name        : new FormControl(this.Ad.Name, Validators.required),
      ProductDesc : new FormControl(this.Ad.ProductDescription, Validators.required),
      City        : new FormControl(this.Ad.City, Validators.required),
    });
  }

  GetuserAd(){
    this.adservice.GetFarmAd().subscribe(data => {
      this.Ad = data;
      this.FormInit();
      this.Loader = false;
    },err=>{
        this.router.navigate(["Farm2backSellProduct"]);
        // this.Loader = true
    })
  };

  TemperoryVideoChange(event){
    this.VideoData = event.target.files[0];
    if(this.VideoData && this.VideoData.size > 16006931){
      this.toast("Your file is too large it must be less than 15mb" , "#e53935 red darken-1");
      this.VideoData    = "";
      return $(".video__input").val("");
    }else{
      $('#video_').attr('src', window.URL.createObjectURL(event.target.files[0]));
      this.AllowSubmit = true;
    }
  }

  TemperoryImageChange(event){
    this.ImageData = event.target.files[0];
    if(this.ImageData && this.ImageData.size > 16006931){
      this.toast("Your file is too large it must be less than 15mb" , "#e53935 red darken-1");
      this.ImageData    = "";
      return $(".image__input").val("");
    }else{
      $('#image_').attr('src', window.URL.createObjectURL(event.target.files[0]));
      this.AllowSubmit = true;
    }
  };


  uploadImage(image_data){
    this.toast("Uploading Image");
    const data = new FormData();
    data.append("file",image_data);
    data.append("upload_preset", this.sync.projectname);
    data.append("cloud_name", this.sync.profilename);
    // we must add /image/upload at the end of this url
    fetch(`https://api.cloudinary.com/v1_1/${this.sync.profilename}/image/upload`,{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
      this.ImageUrl = data.url;
      this.ImageId  = data.public_id;
      this.toast("Image Uploaded");
      return this.EditAd();
    })
    .catch((err)=>{
       this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
    });
  };

  uploadVideo(video_data){
    this.toast("Uploading Video")
    const data = new FormData();
    data.append("file",video_data);
    data.append("upload_preset", this.sync.projectname);
    data.append("cloud_name", this.sync.profilename);
    // we must add /image/upload at the end of this url
    fetch(`https://api.cloudinary.com/v1_1/${this.sync.profilename}/video/upload`,{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
      this.VideoUrl = data.url;
      this.VideoId  = data.public_id;
    })
    .then(()=>{
      this.toast("Video Uploaded")
      this.ImageData ? this.uploadImage(this.ImageData) : this.EditAd();
    })
    .catch((err)=>{
      this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
    });
  };


  toast(text , classes="#43a047 green darken-1"){
    M.toast({html: text , classes : classes})
  };

  SubmitFarmerProductForm(){
    this.Loader = true;
    if(this.VideoData){
      return this.uploadVideo(this.VideoData);
    }
    if(this.ImageData){
      return this.uploadImage(this.ImageData);
    }
    return this.EditAd();
  };

  EditAd(){
    this.adservice.UpdateFarmAd(this.FarmerProductForm.value , this.ImageId , this.ImageUrl , this.VideoId , this.VideoUrl).subscribe(data=>{
      this.Ad = data.farmad;
      this.FormInit();
      this.toast("You Add Is Updated");
      this.router.navigate(["Farm2backSellProduct"]);
      this.Loader = false;
    },err =>{
        this.toast("Unknown Error Occured" , "#e53935 red darken-1");
    });
  };

  AllowSubmitButton(){
    this.AllowSubmit = true;
  }

  NavigateBack(){
    this.router.navigate(["Farm2backSellProduct"]);
  }


}
