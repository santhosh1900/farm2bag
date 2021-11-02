import { Component, OnInit  , Input , OnChanges , SimpleChanges , AfterViewInit , Output , EventEmitter} from '@angular/core';
import { FormGroup , FormBuilder , Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpService } from "../../services/otp.service";
import { TokenService } from "../../services/token.service";
import * as M from "materialize-css";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit ,  OnChanges , AfterViewInit {
  @Output() Logged_User           = new EventEmitter();
  @Input() clear                  : String;
  loginForm                       : FormGroup;
  Request_OTP_Form                : FormGroup;
  Submit_OTP_Form                 : FormGroup;
  Password_Reset_Form             : FormGroup;
  show_login_form                 = true;
  show_forgot_form                = false;
  show_submit_otp_form            = false;
  show_password_rest_form         = false;
  modal_close                     : any;
  password_is_changed             = false;

  constructor(
    private fb : FormBuilder,
    private otpService : OtpService,
    private tokenservice : TokenService,
    private router  : Router
    ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      phoneNumber : ["" , Validators.required],
      password    : ["" , Validators.required],
    });

    this.Request_OTP_Form = this.fb.group({
      phoneNumber : ["" , Validators.required]
    });

    this.Submit_OTP_Form = this.fb.group({
      otp : ["" , Validators.required]
    });

    this.Password_Reset_Form = this.fb.group({
      reset_password   : ["" , Validators.required],
      confirm_password : ["" , Validators.required]
    });

  }

  ngOnChanges(changes:SimpleChanges) : void{
    this.resetForms()
  }

  ngAfterViewInit() {
    this.modal_close = document.querySelector('#login_signIn_modal');
  }

  resetForms(){
    if(!!this.clear == false || this.password_is_changed){
      this.show_login_form                 = true;
      this.show_forgot_form                = false;
      this.show_submit_otp_form            = false;
      this.show_password_rest_form         = false;
      this.password_is_changed             = false;
      this.loginForm.reset();
      this.Request_OTP_Form.reset();
      this.Submit_OTP_Form.reset();
      this.Password_Reset_Form.reset();
    }
  }


  LoginUser(){
    this.otpService.LoginUser(this.loginForm.value.phoneNumber , this.loginForm.value.password).subscribe(data =>{
      this.toast("Welcome to farm2Back" , "#43a047 green darken-1");
      this.loginForm.reset();
      let instance = M.Modal.getInstance(this.modal_close);
      instance.close();
      this.tokenservice.SetUserInfo(data.token);
      this.Logged_User.emit(this.tokenservice.GetUserPayload());
      if(this.tokenservice.GetUserPayload().Admin){
        this.router.navigate(["ServerSide"]);
      }
    },err=>{
      this.loginForm.reset();
      document.querySelector("#not_found").textContent = err.error.message;
      setTimeout(()=>{
        document.querySelector("#not_found").textContent = "";
      },5000);
    });
  }


  ForgotPasswordForm(){
    this.show_login_form       = false;
    this.show_forgot_form      = true;
    this.show_submit_otp_form  = false;
  }

  RequestOTP(){
    console.log(`sending the value phonenumber - ${this.Request_OTP_Form.value.phoneNumber} to backend to request otp `);
    this.otpService.FortgetPasswordOtpRequest(this.Request_OTP_Form.value.phoneNumber).subscribe(data => {
      console.log(data);
      this.toast("OTP is requested" , "#43a047 green darken-1");
      this.show_forgot_form      = false;
      this.show_submit_otp_form  = true;
    },err=>{
      this.toast(err.error.message , "#d32f2f red darken-2");
    });
  }

  SubmitOTP(){
    this.otpService.SubmitFortgetPasswordOtp(this.Request_OTP_Form.value.phoneNumber  , this.Submit_OTP_Form.value.otp).subscribe(data => {
      console.log(data);
      this.show_submit_otp_form    = false;
      this.show_password_rest_form = true;
      this.toast(data.message , "#43a047 green darken-1")
    },err=>{
      this.toast(err.error.message , "#d32f2f red darken-2");
    })

    
  }

  ChangePassword(){
    console.log(`sending new password ${this.Password_Reset_Form.value.reset_password , this.Request_OTP_Form.value.phoneNumber} only to backend`);
    this.otpService.ChangePassword(this.Request_OTP_Form.value.phoneNumber,this.Submit_OTP_Form.value.otp,this.Password_Reset_Form.value.reset_password).subscribe(data=>{
      console.log(data);
      this.toast("Password Successfully Changed" , "#43a047 green darken-1");
      this.Password_Reset_Form.reset();
      let instance = M.Modal.getInstance(this.modal_close);
      instance.close();
      this.password_is_changed = true;
      this.resetForms();
    })
  }

  toast(text , classes = ""){
    M.toast({html: text , classes : classes})
  }


}
