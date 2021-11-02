import { Component, OnInit , Output , EventEmitter } from '@angular/core';
import { FormGroup , FormBuilder , Validator, Validators , FormControl } from '@angular/forms';
import { TokenService } from "../../services/token.service";
import { Router } from '@angular/router';
import { OtpService } from "../../services/otp.service";
import * as $ from "jquery";
import * as M from "materialize-css";

@Component({
  selector: 'app-accountinfo',
  templateUrl: './accountinfo.component.html',
  styleUrls: ['./accountinfo.component.css']
})
export class AccountinfoComponent implements OnInit {
  @Output() Logged_User     = new EventEmitter();
  CurrentUser               : any;
  saveChange                = false;
  Profile_Edit_Form         : FormGroup;
  OTP_Form                  : FormGroup;
  Loader                    = true;
  OtpForm                   = false;
  OpenProfileFormBtnClicked = false;
  sync                        = this.tokenservice.cloudinary();  

  constructor(
    private router : Router,
    private fb : FormBuilder,
    private tokenservice : TokenService,
    private otpService  : OtpService
  ) { }

  ngOnInit(): void {
    this.GetCurrentUser();
    this.Profile_Edit_Form = this.fb.group({
      PhoneNumber : new FormControl('', Validators.required),
      Email       : new FormControl('', Validators.required),
      Gender      : new FormControl('', Validators.required),
      Username    : new FormControl('', Validators.required),
    });

    this.OTP_Form = this.fb.group({
      otp : new FormControl('', Validators.required),
    });
  }

  InitilizeProfileEditForm(username , phonenumber , email , gender){
    this.Profile_Edit_Form = this.fb.group({
      PhoneNumber : new FormControl( phonenumber , Validators.required),
      Email       : new FormControl( email , Validators.required),
      Gender      : new FormControl( gender , Validators.required),
      Username    : new FormControl( username , Validators.required),
    });
  }

  GetCurrentUser(){
    this.otpService.GetUserInfo().subscribe(data => {
      this.CurrentUser = data.CurrentUser;
      console.log(this.CurrentUser);
      this.Loader = false;
      setTimeout(()=>{
        this.InitilizeProfileForm();
        this.SetAddressRowNumber(0);
      },300);
    });
  }

  OpenProfileForm(){
    $(".profile__input").removeAttr('disabled');
    $(".profile_input_label").removeClass("hide");
    this.saveChange = true;
    this.OpenProfileFormBtnClicked = true;
  }

  CloseProfileForm(){
    this.InitilizeProfileForm();
    this.OpenProfileFormBtnClicked = false;
    this.saveChange = false;
  }


  InitilizeProfileForm(){
    $(".profile__input").attr('disabled','disabled');
    $(".profile_input_label").addClass("hide");
    var gender = "";
    this.CurrentUser.Gender == "Male" || !this.CurrentUser.Gender ? gender = "Male" : gender = "Female";
    this.InitilizeProfileEditForm(this.CurrentUser.Username ,this.CurrentUser.PhoneNumber , this.CurrentUser.Email , gender);
  }

  SubmitProfileEditForm(){
    console.log(this.Profile_Edit_Form.value.PhoneNumber);
    if(this.Profile_Edit_Form.value.PhoneNumber   != this.CurrentUser.PhoneNumber){
      var number  = this.Profile_Edit_Form.value.PhoneNumber + "";
      return this.otpService.RequestMobileNumberChange(number).subscribe(data => {
        this.toast(data.message);
        console.log(data);
        return this.OtpForm = true;
      },err=>{
        this.toast(err.error.message , "#e53935 red darken-1");
        return this.OtpForm = false;
      });
    }
    if(this.Profile_Edit_Form.value.PhoneNumber   != this.CurrentUser.PhoneNumber ||
        this.Profile_Edit_Form.value.Username     != this.CurrentUser.Username ||
        this.Profile_Edit_Form.value.Email        != this.CurrentUser.Email ||
        this.Profile_Edit_Form.value.Gender       != this.CurrentUser.Gender)
      {
        return this.EditUserProfile();
      }else{
        return this.toast("Profile Feild Has Not Changed" , "#b71c1c red darken-4");
      }
  };

  EditPhoneNumber(){
    if(this.saveChange == false ||  this.OtpForm == true){
      this.saveChange = true;
      this.OtpForm = false;
      this.OTP_Form.reset();
    }
  }

  EditUserProfile(){
    this.otpService.EditUserInfo(this.Profile_Edit_Form.value).subscribe( data => {
      this.CurrentUser = data.user;
      this.tokenservice.SetUserInfo(data.token);
      this.Logged_User.emit(this.tokenservice.GetUserPayload());
      console.log(this.tokenservice.GetUserPayload());
      setTimeout(()=>{
        this.InitilizeProfileForm();
        this.OpenProfileFormBtnClicked = false;
        this.saveChange = false;
      },300);
    } , err => {
      return this.toast("Unknown Error Occured" , "#d32f2f red darken-2");
    });
  }

  SubmitOTPForm(){
    console.log(this.OTP_Form.value.otp , this.Profile_Edit_Form.value.PhoneNumber);
    this.otpService.ChangeUserPhoneNumber(this.Profile_Edit_Form.value.PhoneNumber , this.OTP_Form.value.otp ).subscribe(data => {
      this.CurrentUser = data.user;
      this.tokenservice.SetUserInfo(data.token);
      this.Logged_User.emit(this.tokenservice.GetUserPayload());
      console.log(this.tokenservice.GetUserPayload());
      this.OTP_Form.reset;
      setTimeout(()=>{
        this.InitilizeProfileForm();
        this.OpenProfileFormBtnClicked = false;
        this.saveChange = false;
        this.OTP_Form.reset();
        return this.OtpForm = false;
      },300);
    } , err =>{
      return this.toast(err.message , "#d32f2f red darken-2");
    });
  };


  NavigateToAddressForm(){
    this.router.navigate(["addressform"])
  }


  EditAddress(address){
    console.log(address.User_Address)
    const edit_address =  JSON.stringify(address.User_Address);
    localStorage.setItem("edit_address",edit_address);
    this.router.navigate([`editaddressform/${address.User_Address._id}`]);
  }


  DeleteAddress(address){
    console.log(address.User_Address._id);
    this.otpService.DeleteAdress(address.User_Address._id , address._id ).subscribe(data => {
      this.CurrentUser = data.user;
      this.SetAddressRowNumber(300);
    });
  };


  SetAddressRowNumber(number){
    setTimeout(()=>{
      var length = document.querySelectorAll(".address__Number").length;
      for(let i = 0 ; i < length ; i++){
        document.querySelectorAll(".address__Number")[i].textContent = `${i + 1}`
      }
    },number);
  }

  toast(text , classes="#43a047 green darken-1"){
    M.toast({html: text , classes : classes})
  }

  SelectImage(event){
   var ImageData      = event.target.files[0]; 
    if(ImageData && ImageData.size > 16006931){
      return this.toast("Your file is too large it must be less than 15mb" , "#e53935 red darken-1");
    }
    $('#profile__image').attr('src', window.URL.createObjectURL(event.target.files[0]));
    return this.UploadImage(ImageData);
  }

  UploadImage(imgdata){
    this.toast("Uploading Image");
    const data = new FormData();
    data.append("file",imgdata);
    data.append("upload_preset", this.sync.projectname);
    data.append("cloud_name", this.sync.profilename);
    // we must add /image/upload at the end of this url
    fetch(`https://api.cloudinary.com/v1_1/${this.sync.profilename}/image/upload`,{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
      this.UpdateDP(data.public_id , data.url);
    })
    .catch((err)=>{
      this.toast("Oops Something Went Wrong" , "#e53935 red darken-1");
    });
  };

  UpdateDP(ImgId , ImgUrl){
    this.otpService.UpdateDP(ImgId , ImgUrl).subscribe(data => {
      this.toast("Profile Picture Updated");
    })
  }


  // $(".profile__input").attr('disabled','disabled');
  // setTimeout(()=>{
  //   $(".input__text").removeAttr('disabled');
  // },4000)

}
