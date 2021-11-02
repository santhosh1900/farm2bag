import { Component, OnInit } from '@angular/core';
import { FormGroup , FormBuilder , Validator, Validators } from '@angular/forms';
import * as $ from "jquery";
import * as M from "materialize-css";
import { TokenService } from "../../services/token.service";
import { Router } from '@angular/router';
import { AduploadService } from "../../services/adupload.service";


@Component({
  selector: 'app-productform',
  templateUrl: './productform.component.html',
  styleUrls: ['./productform.component.css']
})
export class ProductformComponent implements OnInit {

  ProductForm             : FormGroup;

  FarmerProductForm       : FormGroup;

  Loader                  = false;

  FarmerFormDisplay       = true;

  ProductFormDisplay      = false;

  Location                : String;

  ImageUrl                : String; 

  ImageId                 : String; 

  AddressProffUrl         : String;

  AddressProffId          : String;

  VideoUrl                = "";   

  VideoId                 = "";  

  ImageData               : any;

  VideoData               : any;

  AddressProffData        : any;

  Username                = this.tokenservice.GetUserPayload().Username;  

  sync                    = this.tokenservice.cloudinary(); 
  
  FarmerAddExists         : Boolean; 
  
  WholesaleAdExists       : Boolean;
  

  constructor(
    private fb           : FormBuilder,
    private tokenservice : TokenService,
    private uploadAd     : AduploadService,
    private router : Router,
  ) { }

  ngOnInit(): void {


    this.Loader = true;
    this.FormInit();
    this.MaterialInit();
    this.GetUserAds();
  }


  GetUserAds(){
    this.uploadAd.GetUserAds().subscribe(data =>{
      console.log(data);
      data.farmerAdPresent ? this.FarmerAddExists = true : this.FarmerAddExists = false;
      data.wholesaleAdpresent ? this.WholesaleAdExists = true : this.WholesaleAdExists = false;
      this.Loader = false
    })
  }

  FormInit(){
    this.ProductForm = this.fb.group({
      Username    : [ this.Username , Validators.required ],
      ProdcutName : [ "" , Validators.required ],
      Line1       : [ "" , Validators.required ],
      Line2       : [ "" , Validators.required ],
      Area        : [ "" , Validators.required ],
      State       : [ "" , Validators.required ],
      Pincode     : [ "" , Validators.required ],
      Landmark    : [ "" , Validators.required ],
      ProductDesc : [ "" , Validators.required ],
      City        : [ "" , Validators.required ]
    });

    this.FarmerProductForm = this.fb.group({
      Username    : [ this.Username , Validators.required ],
      Name        : [ "" , Validators.required],
      ProductDesc : [ "" , Validators.required ],
      City        : [ "" , Validators.required ],
    });
  }


  MaterialInit(){
    var Select  = document.querySelectorAll('.select');
    var Tabs    = document.querySelectorAll('.tabs');
    M.Tabs.init(Tabs, {});
    M.FormSelect.init(Select, {});
    $(".indicator").css("background-color" , "#b4aab4");
  }

  DiplayFarmer(){
    this.ImageData            = "";
    this.FarmerFormDisplay    = true;
    this.ProductFormDisplay   = false;
    this.Location             = "";
    this.ImageUrl             = "";               
    this.ImageId              = "";             
    this.VideoUrl             = "";               
    this.VideoId              = "";
    this.MaterialInit(); 
    this.ImageData            = "";
    this.VideoData            = "";
    this.AddressProffData     = "";
    this.FormInit();
    $(".image__input").val("");
    $(".video__input").val("");
  }

  DiplayProduct(){
    this.ImageData            = "";
    this.FarmerFormDisplay    = false;
    this.ProductFormDisplay   = true;
    this.Location             = "";
    this.ImageUrl             = "";               
    this.ImageId              = "";             
    this.VideoUrl             = "";               
    this.VideoId              = "";
    this.MaterialInit(); 
    this.ImageData            = "";
    this.VideoData            = "";
    this.AddressProffData     = "";
    this.FormInit();
    $(".video__input").val("");
    $(".image__input").val("");
  }

  SelectImage(event){
    this.ImageData      = event.target.files[0]; 
    if(this.ImageData && this.ImageData.size > 16006931){
      this.toast("Your file is too large it must be less than 15mb" , "#e53935 red darken-1");
      this.ImageData    = "";
      return $(".image__input").val(""); 
    }
  }

  SelectAddressProffImage(event){
    this.AddressProffData   = event.target.files[0];
    if(this.AddressProffData && this.AddressProffData.size > 16006931){
      this.toast("Your file is too large it must be less than 15mb" , "#e53935 red darken-1");
      this.AddressProffData    = "";
      return $(".image__input").val(""); 
    }
  }

  SelectVideo(event){
    this.VideoData      = event.target.files[0];
    if(this.VideoData && this.VideoData.size > 30000000){
      this.toast("Your file is too large it must be less than 30mb" , "#e53935 red darken-1");
      this.VideoData    = "";
      return $(".video__input").val("");
    }
  }

  SubmitFarmerProductForm(){
    this.toast("Your AD is uploading please wait" , "#ffeb3b yellow");
    this.Loader = true;
    if(this.VideoData){
      return this.uploadVideo(this.VideoData , "Farmer");
    }
    return this.uploadImage(this.ImageData);
  }

  uploadImage(image_data , Catrgory = ""){
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
      Catrgory != "WholeSale" ? this.SubmitToBackendFarmer() : this.uploadAddressProffImage(this.AddressProffData);
    })
    .catch((err)=>{
       this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
       this.Loader = false;
    });
  };


  uploadAddressProffImage(image_data){
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
      this.AddressProffUrl   = data.url;
      this.AddressProffId    = data.public_id;
    }).then(()=>{
      this.SubmitToBackendWholesale();
    })
    .catch((err)=>{
      this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
      this.Loader = false;
    });
  };


  uploadVideo(video_data , Category = ""){
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
      return this.uploadImage(this.ImageData , Category);
    })
    .catch((err)=>{
      this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
      this.Loader = false;
    });
  };

  SubmitToBackendFarmer(){
    this.uploadAd.PostFarmerAd(this.FarmerProductForm.value , this.ImageUrl , this.ImageId , this.VideoUrl , this.VideoId).subscribe(data => {
      $(".video__input").val("");
      $(".image__input").val("");
      this.FormInit();
      this.ImageData = "";
      this.VideoData = "";
      this.toast("Your Ad is successfully posted");
      this.Loader = false;
      this.FarmerAddExists = true;
    },err => {
      this.toast(err.error.message , "#e53935 red darken-1");
      this.Loader = false;
      this.FarmerAddExists = false;
    });
  };

  DeleteFarmerAd(){
    this.Loader = true;
    this.uploadAd.DeleteFarmerAd().subscribe(data => {
      this.toast("Your Ad is Successfully Deleted");
      this.FarmerAddExists = false;
      this.Loader = false;
    },err=>{
      this.toast(err.error.message , "#e53935 red darken-1")
    });
  }


  SubmitProductForm(){
    this.Loader = true;
    this.toast("Your Ad is Uploading , Please Wait" , "#ffeb3b yellow")
    if(this.VideoData){
      return this.uploadVideo(this.VideoData , "WholeSale");
    }
    return this.uploadImage(this.ImageData , "WholeSale");
  }


  SubmitToBackendWholesale(){
    if(navigator.geolocation){
      return navigator.geolocation.getCurrentPosition((position) => {
        this.SubmitToBackendWholesale2(position.coords.longitude , position.coords.latitude);
      });
    }else 
    {
      this.SubmitToBackendWholesale2();
    }
  };

  SubmitToBackendWholesale2(Longitude = 0 , Latitude = 0){
    this.uploadAd.PostWholeSaleAd(this.ProductForm.value , 
      this.ImageUrl, 
      this.ImageId, 
      this.VideoUrl, 
      this.VideoId, 
      this.AddressProffUrl, 
      this.AddressProffId,
      Longitude,
      Latitude)
    .subscribe(data => {
      this.ResetWholeSaleForm();
    },err => {
      this.Loader = false;
    });
  }

  ResetWholeSaleForm(){
    $(".video__input").val("");
    $(".image__input").val("");
    this.FormInit();
    this.ImageData        = "";
    this.VideoData        = "";
    this.AddressProffData = "";
    this.ProductForm.reset();
    this.Loader = false;
    this.WholesaleAdExists = true;
  }

  DeleteWholesaleAd(){
    this.Loader = true;
    this.uploadAd.DeleteWholesaleAd().subscribe(data=>{
      this.Loader = false;
      this.WholesaleAdExists = false;
      this.toast("Your Ad is Successfully Deleted");
    },err => {
      this.Loader = false;
      this.toast(err.error.message , "#e53935 red darken-1")
    });
  };

  FarmAdEditPage(){
    this.router.navigate(["FarmerAdEdit"])
  };

  WholesaleAdEditPage(){
    this.router.navigate(["WholesaleAdEdit"]);
  }
  

  toast(text , classes="#43a047 green darken-1"){
    M.toast({html: text , classes : classes})
  };

}
