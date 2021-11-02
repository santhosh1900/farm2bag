import { Component, OnInit  , Input , OnChanges , SimpleChanges , AfterViewInit, EventEmitter , Output} from '@angular/core';
import { FormGroup , FormBuilder , Validator, Validators } from '@angular/forms';
import * as M from "materialize-css";
import { OtpService } from "../../services/otp.service";
import { TokenService } from "../../services/token.service";
import * as $ from "jquery";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnChanges , AfterViewInit {
  @Output() Logged_User = new EventEmitter();
  @Input() clear        : String;
  signinForm            : FormGroup;
  otpForm               : FormGroup;
  ProfileForm           : FormGroup;
  show_signup_form      = true;
  show_submit_otp_form  = false;
  otp                   : string;
  phone                 : string;
  close_modal           : any;
  new_memeber           = false;
  Set_Profile           = false;
  Username              : String;
  Password              : String;
  ConfirmPassword       : String;
  resendOTP             = false;
  Edit_Number           = false;
  Previous_Number       : String;

  constructor(
    private fb : FormBuilder,
    private otpService : OtpService,
    private tokenservice : TokenService
  ) { 
   }

  ngOnChanges(changes:SimpleChanges) : void{
    this.resetForms();
  }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      MobileNumber : ["" , Validators.required]
    });

    this.otpForm = this.fb.group({
      otp : ["" , Validators.required]
    });

    this.ProfileForm = this.fb.group({
      Username        : ["" ,  Validators.required],
      Password        : ["" ,  Validators.required],
      ConfirmPassword : ["" ,  Validators.required]
    });
  }

  ngAfterViewInit(){
    this.close_modal = document.querySelector('#login_signIn_modal');
  }

  SignInUser(){
    this.Edit_Number ? this.EditNumber(this.signinForm.value.MobileNumber , this.Previous_Number) : this.SendOTP(this.signinForm.value.MobileNumber);
  }


  SendOTP(MobileNumber){
    this.otpService.SendOtp(MobileNumber).subscribe(data => {
      console.log(data);
      this.Edit_Number = false
      this.toast("OTP is Sent to Your Mobilenumber" , "#43a047 green darken-1");
      this.show_signup_form      = false;
      this.show_submit_otp_form  = true;
    },
    err => {
      document.querySelector("#NumberExist").textContent = "Number Already Exist";
      setTimeout(()=>{
        document.querySelector("#NumberExist").textContent = "";
      },3000)
    });
  }

  EditNumber(mobilenumber , prevoiusNumber){
    this.otpService.EditOTPNumebr(mobilenumber , prevoiusNumber).subscribe(data => {
      console.log(data);
      this.Edit_Number = false
      this.toast("OTP is Sent to Your Mobilenumber" , "#43a047 green darken-1");
      this.show_signup_form      = false;
      this.show_submit_otp_form  = true;
    });
  }

  Edit_number(){
    this.show_signup_form     = true;
    this.show_submit_otp_form = false;
    this.Edit_Number          = true;
    this.Previous_Number      = this.signinForm.value.MobileNumber + "";
  }


  Submit_OTP(){
    this.resendOTP = false;
    this.otpService.VerifyOTP(this.phone, this.otp).subscribe(data => {
      console.log(data)
      this.otp                    = "";
      this.show_submit_otp_form   = false;
      this.Set_Profile            = true; 
    },
    err => {
      this.otpForm.reset();
      document.querySelector("#wrong_otp").textContent = "Incorrect OTP";
      this.resendOTP = true;
      setTimeout(()=>{
        document.querySelector("#wrong_otp").textContent = "Only four digits number is allowed";
      },3000)
    });
  }

  resend_OTP(){
    this.SignInUser();
    this.resendOTP = false;
  }


  Profile_Submit(){
    this.otpService.RegisterUser(this.Username , this.Password , this.phone).subscribe(data => {
      this.toast("New Account is created Welcome to Farm2Bag" , "#43a047 green darken-1");
      let instance = M.Modal.getInstance(this.close_modal);
      instance.close();
      this.new_memeber = true;
      this.resetForms();
      this.tokenservice.SetUserInfo(data.token);
      this.Logged_User.emit(this.tokenservice.GetUserPayload());
    });
  }

  resetAll(){
    this.show_signup_form               = true;
    this.show_submit_otp_form           = false;
    this.Set_Profile                    = false;
    this.otp                            = "";
    this.phone                          = "";
    
  }
  
  resetForms(){
    if(!!this.clear == false || this.new_memeber){
      this.phone                = "";
      this.otp                  = "";
      this.show_signup_form     = true;
      this.show_submit_otp_form = false;
      this.new_memeber          = false;
      this.Set_Profile          = false;
      this.ProfileForm.reset();
    }
  }

  toast(text , classes = ""){
    M.toast({html: text , classes : classes })
  }

}
