import { Component, OnInit , EventEmitter , Output} from '@angular/core';
import { OtpService } from "../../services/otp.service";
import * as $ from "jquery";
import { LocationService } from 'src/app/services/location.service';
// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');


@Component({
  selector: 'app-explore-world-user-side',
  templateUrl: './explore-world-user-side.component.html',
  styleUrls: ['./explore-world-user-side.component.css']
})
export class ExploreWorldUserSideComponent implements OnInit {

  CurretnUser                     : any;
  Loader                          = true;
  @Output() AdEvent               = new EventEmitter<string>();
  FarmerSelected                  = true;
  @Output() DelyaLoader           = new EventEmitter<string>();

  constructor(
    private userservice : OtpService,
    private locationservice : LocationService

  ) { }

  ngOnInit(): void {
    this.GetUserInfo();
  }

  GetUserInfo(){
    this.userservice.GetUserInfo().subscribe(data => {
      this.CurretnUser = data.CurrentUser;
      this.Loader      = false;
    },err => {
      this.toast("Unkown Error Occured" , "#ef5350 red lighten-1");
    })
  };

  toast(text , classes="#43a047 green darken-1"){
    M.toast({html: text , classes : classes})
  }

  AdSelectFarmer(){
    this.DelyaLoader.emit("Delay");
    setTimeout(()=>{
      this.DelyaLoader.emit("No_Delay");
      this.FarmerSelected == true ? this.FarmerSelected = true : this.AdEvent.emit("Farmer");
      this.FarmerSelected = true;
    },3000);
     
  }

  AdSelectWholesale(){
    this.DelyaLoader.emit("Delay")
    setTimeout(()=>{
      this.DelyaLoader.emit("No_Delay");
      this.FarmerSelected == false ? this.FarmerSelected = false : this.AdEvent.emit("Wholesale"); 
      this.FarmerSelected = false;
    },3000);     
  }


  getLocation(){
    if(navigator.geolocation){
      return navigator.geolocation.getCurrentPosition((position) => {
        this.SubmitLocation(position.coords.longitude , position.coords.latitude);
      });
    }else 
    {
      alert('It seems like Geolocation, which is required for this page, is not enabled in your browser.');
    }
  }

  SubmitLocation(longitude , latitude){
    this.locationservice.SubmitLocation(longitude , latitude).subscribe(data => {
      console.log(data);
    })
  }

  // mapinit(){
  //   mapboxgl.accessToken = 'pk.eyJ1Ijoic2FuZHkxNjkyMDAwIiwiYSI6ImNrOW51MXJzMjA0czEzbHBhZXR5dzF0NDUifQ.p7H76vCl2BgDcKwPyq9tgg';
  //   var map = new mapboxgl.Map({
  //     container: 'map',
  //     style: 'mapbox://styles/mapbox/streets-v11',
  //     center : [80.19865399999999 , 13.0908188],
  //     zoom : 15
  //   });

  //   var marker = new mapboxgl.Marker().setLngLat([80.19865399999999 , 13.0908188]).addTo(map)

  // }




}
