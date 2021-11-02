import { Component, OnInit , Output , EventEmitter } from '@angular/core';
import { FormGroup , FormBuilder , Validator, Validators , FormControl } from '@angular/forms';
// import { Router } from '@angular/router';
import { TokenService } from "../../services/token.service";
import { Router , ActivatedRoute } from '@angular/router';
import { OtpService } from "../../services/otp.service";
import * as $ from "jquery";
import * as M from "materialize-css";

@Component({
  selector: 'app-addressform',
  templateUrl: './addressform.component.html',
  styleUrls: ['./addressform.component.css']
})
export class AddressformComponent implements OnInit {

  AddressForm     : FormGroup;

  params          : any;

  going_to_edit   : any;

  EditAddressForm : FormGroup;

  savechangebtn   = false;


  constructor(
    private fb : FormBuilder,
    private router : Router,
    private otpservice : OtpService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.AddressForm = this.fb.group({
      Line1       : new FormControl('', Validators.required),
      Line2       : new FormControl('', Validators.required),
      City        : new FormControl('', Validators.required),
      State       : new FormControl('', Validators.required),
      Pincode     : new FormControl('', Validators.required),
      Landmark    : new FormControl('', Validators.required),
      Area        : new FormControl('', Validators.required)
    });

    // this.EditAddressForm = this.fb.group({
    //   Line1       : new FormControl('', Validators.required),
    //   Line2       : [ "" , Validators.required ],
    //   City        : [ "" , Validators.required ],
    //   State       : [ "" , Validators.required ],
    //   Pincode     : [ "" , Validators.required ],
    //   Landmark    : [ "" , Validators.required ]
    // });

    this.params = this.route.snapshot.paramMap.get("id");
    this.params ? this.checkParams() : "";

  }

  SubmitAddressForm(){
    this.otpservice.SubmitAddress(this.AddressForm.value).subscribe(data => {
      this.toast("Address Is Saved");
      this.AddressForm.reset();
      this.profilepge();
    },err => {
      this.toast("Unknown Error Occured" , "#e53935 red darken-1")
    });
    
  }

  checkParams(){
    if(this.params == JSON.parse(localStorage.getItem("edit_address"))._id){
      this.get_the_address();
    }else{
      this.toast("Invalid Address" , "#e53935 red darken-1" );
      this.router.navigate(["addressform"])
    }
  }

  profilepge(){
    this.router.navigate(["myprofile"]);
    localStorage.removeItem("edit_address");
  }


  get_the_address(){
    this.going_to_edit = JSON.parse(localStorage.getItem("edit_address"));
    this.EditAddressForm = this.fb.group({
      // new FormControl('', Validators.required),
      Line1       : new FormControl(this.going_to_edit.Line1, Validators.required),
      Line2       : new FormControl(this.going_to_edit.Line2, Validators.required),
      City        : new FormControl(this.going_to_edit.City, Validators.required),
      State       : new FormControl(this.going_to_edit.State, Validators.required),
      Pincode     : new FormControl(this.going_to_edit.Pincode, Validators.required),
      Landmark    : new FormControl(this.going_to_edit.Landmark, Validators.required),
      Area        : new FormControl(this.going_to_edit.Area, Validators.required)
    });
  };

  SubmitEditAddressForm(){
    this.otpservice.EditAdress(this.going_to_edit._id ,this.EditAddressForm.value ).subscribe(data => {
      this.toast(data.message);
      this.router.navigate(["myprofile"]);
    }, err => {
      this.toast("Unknown Error Occured" , "#e53935 red darken-1")
    })

  };

  editkeydown(event){
    this.savechangebtn = true;
  };

  toast(text , classes="#43a047 green darken-1"){
    M.toast({html: text , classes : classes})
  };

}
