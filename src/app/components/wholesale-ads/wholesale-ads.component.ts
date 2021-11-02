import { Component, OnInit , OnChanges , SimpleChanges , Input } from '@angular/core';
import { TokenService } from "../../services/token.service";
import { AduploadService } from "../../services/adupload.service"; 
import * as M from "materialize-css";
import { FormGroup , FormBuilder , FormControl , Validator, Validators } from '@angular/forms';
import * as moment from "moment";
import * as _ from 'lodash';
import * as $ from "jquery";
import * as mapboxgl from "mapbox-gl";
import { GeoJson  , FeatureCollection} from "../map";
import { style } from '@angular/animations';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FuZHkxNjkyMDAwIiwiYSI6ImNrOW51MXJzMjA0czEzbHBhZXR5dzF0NDUifQ.p7H76vCl2BgDcKwPyq9tgg';

@Component({
  selector: 'app-wholesale-ads',
  templateUrl: './wholesale-ads.component.html',
  styleUrls: ['./wholesale-ads.component.css']
})
export class WholesaleAdsComponent implements OnInit {

  City                  : String;
  Loader                = true;
  WholesaleAds          : any;
  CurrentUser           = this.tokenservice.GetUserPayload();
  @Input() Location     = String;
  @Input() Delay        = String;
  CommentForm           : FormGroup; 
  Modal                 : any;
  ModalInstances        : any;
  CommentLoader         = true;
  SelectedAd            : any;
  CommentBtnClicked     = false;
  CommentsArray         : any;
  ActivateUpdateBtn     = false;
  SelectedComment       : any;
  SelectedCommentText   = "";
  DelayLoader           = true;
  AddressModal          : any;
  Mapfound              = true;
  mapboxapi             = this.tokenservice.mapbox();
  UserLatitude          = 0;
  UserLongitude         = 0; 

  map                   : mapboxgl.Map;
  style                 = 'mapbox://styles/mapbox/streets-v11';

  constructor(
    private tokenservice : TokenService,
    private AdService    : AduploadService,
    private location     : LocationService,
    private fb           : FormBuilder,
    private router       : Router

  ) { }

  ngOnInit(): void {
    this.InitLocation();
    this.InitCommentForm();
    mapboxgl.accessToken = this.mapboxapi.api;
    this.InitUserLocation();
  }

  ngOnChanges(changes:SimpleChanges) : void{
    if(!changes.Delay){
      this.GetAllWholesaleAds(this.Location);
    }
    this.Delay + '' == "Delay" ? this.DelayLoader = true : this.DelayLoader = false;
  }

  buildmap(lng : Number =  0 , lat : Number =  0){
    this.map = new mapboxgl.Map({
      container : "map",
      style     : this.style,
      zoom      : 15,
      center    : [lng , lat],
    });
    var marker = new mapboxgl.Marker()
      .setLngLat([lng , lat])
      .addTo(this.map);
  };

  InitCommentForm(){
    this.CommentForm = this.fb.group({
      Comment    : new FormControl( "" , Validators.required)
    });
  }

  InitUserLocation(){
    if(navigator.geolocation){
      return navigator.geolocation.getCurrentPosition((position) => {
        this.UserLatitude  = position.coords.latitude;
        this.UserLongitude = position.coords.longitude;
      });
    }else 
    {
      this.UserLatitude = this.CurrentUser.Latitude;
      this.UserLongitude = this.CurrentUser.Longitude;
    }
  }

  InitLocation(){
    this.tokenservice.GetLocation() ? this.City = this.tokenservice.GetLocation() : this.City = "Chennai";
    this.GetAllWholesaleAds(this.City)
  }

  GetAllWholesaleAds(City){
    this.AdService.GetAllWholesaleAds(City).subscribe(data => {
      this.WholesaleAds = data.AllWholesaleAds;
      this.Loader = false;
      setTimeout(()=>{
        this.InitToolTip();
      },1000);
    })
  }

  InitToolTip(){
    if(!this.checker){
      var elems = document.querySelectorAll('.tooltipped');
      M.Tooltip.init(elems, {});
    }

    var tab   = document.querySelectorAll('.tabs');
    M.Tabs.init(tab, {});

    this.Modal        = document.querySelector('.WholesaleCommentModels');
    M.Modal.init(this.Modal, {});
    this.ModalInstances = M.Modal.getInstance(this.Modal);

    var address_modal = document.querySelector('.address__modal');
    M.Modal.init(address_modal, {});
    this.AddressModal =  M.Modal.getInstance(address_modal);
    
  }

  InitTextArea(num){
    setTimeout(()=>{
      var d = document.querySelectorAll('.materialize-textarea');
      for(let i = 0 ; i < d.length ; i++){
        M.textareaAutoResize(d[i]);
      }
    },num);
  }

  OpenModal(id){
    this.SelectedAd = id;
    this.ModalInstances.open();
    this.CommentLoader = true;
    this.AdService.GetAllWholesaleAdComment(this.SelectedAd).subscribe(data => {
      this.CommentsArray = data;
      this.CommentLoader = false;
      this.InitCommentForm();
      this.InitTextArea(1000);
    })
  }

  GetTime(time){
    return moment(time).fromNow();
  }

  ViewTheAd(id){
    this.AdService.AddViewToWholesale(id).subscribe(data => {
      console.log(data);
      this.IncreaseTheView(id)
    })
  }

  IncreaseTheView(id){
    this.WholesaleAds.forEach(ad => {
      if(ad._id == id){
        console.log(ad.ProductDescription)
        var user = {
          User : this.CurrentUser._id,
          _id  : "343423441231dsfafaf"
        }
        ad.Views.push(user);
        this.toast("Ad is Marked as Viewed");
        return ad.ViewsCount++
      }
    });
  }

  CheckInViews(arr , id){
    return _.some(arr , { User : id });
  }

  checker(){
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if(isMobile){
      return true;
    }
    return false
  }


  SubmitForm(){
    this.CommentBtnClicked  = true;
    this.AdService.AddWholesaleAdComment(this.CommentForm.value , this.SelectedAd).subscribe(data => {
      this.PushComment(data.Created_comment);
      this.CommentForm.reset();
      this.IncreaseTheCommentCount(this.SelectedAd);
      this.CommentBtnClicked = false
    });
  }

  PushComment(data){
    var comment = {
      _id     : data._id,
      Created : data.Created,
      Text    : data.Text,
      UserId  : {
        ProfilePic : this.CurrentUser.ProfilePic,
        Username   : this.CurrentUser.Username,
        _id        : this.CurrentUser._id,
      } 
    };
    this.CommentsArray.unshift(comment);
    this.InitTextArea(500);
  }


  IncreaseTheCommentCount(id){
    this.WholesaleAds.forEach(ad => {
      if(ad._id == id){
        this.toast("Your is Posted")
        return ad.CommentsCount++;
      }
    });
  }

  DecreaseTheCommentCount(id){
    this.WholesaleAds.forEach(ad => {
      if(ad._id == id){
        return ad.CommentsCount--;
      }
    });
  }


  DeleteComment(id){
    this.AdService.DeleteWholesaleAdComments(id , this.CurrentUser._id , this.SelectedAd).subscribe(data => {
      _.remove(this.CommentsArray, (n : any) => n._id == id);
      this.DecreaseTheCommentCount(this.SelectedAd);
      this.toast("Your Comment is Deleted");
    },err=>{
      this.toast("Unknown Error Occured" , "#e53935 red darken-1")
    })
  }

  UpdateComment(Id , text){
    var id = Id.substring( Id.length - 5 );

    if(!this.SelectedComment){
      this.SelectedComment      = Id;
      this.SelectedCommentText  = text;
    }else{
      if(this.SelectedComment != Id){
        return this.toast("Please Update The Selected Comment" , "#e53935 red darken-1");
      }
      else if($(`.com${id}`).val() == this.SelectedCommentText){
        return this.toast("You Din't Change The Comment" , "#e53935 red darken-1");
      }
      else if($(`.com${id}`).val() != this.SelectedCommentText){
        this.UpdateCommentToBackEnd(this.SelectedComment , $(`.com${id}`).val());
      }
      else{
        return this.toast("Unkown Error Occured" , "#e53935 red darken-1");
      }
    }

    var InputClassName        = `com${id}`;
    var UpdateBtnnName        = `btn${id}`; 
    var CancelBtn             = `cancel${id}`;

    if(!this.ActivateUpdateBtn){
      $(`.${InputClassName}`).removeAttr('readonly');
      $(`.${InputClassName}`).attr('style', "border-bottom:#00BB00 1px solid;");
      $(`.${UpdateBtnnName}`).text("Update Comment");
      $(`.${InputClassName}`).removeClass("comment__input");
      $(`.${CancelBtn}`).removeClass("cancel_btn");
      this.InitTextArea(0);
      this.ActivateUpdateBtn    = true;
    }
  }


  UpdateCommentToBackEnd(id , text){
    this.AdService.UpdateComment(id , text , this.CurrentUser._id).subscribe(data => {
      this.toast("Your Comment Is Updated");
      this.CancelUpdate(id , true , data.comment.Text , this.GetTime(data.Created));
    })
  }


  CancelUpdate(Id,Change = false , Text = "" , Time = ""){
    var id = Id.substring( Id.length - 5 );
    if(this.SelectedComment == Id){
      $(`.com${id}`).attr('readonly', "true");
      !Change ? $(`.com${id}`).val(this.SelectedCommentText) : $(`.com${id}`).val(Text);
      $(`.com${id}`).addClass("comment__input");
      $(`.cancel${id}`).addClass("cancel_btn");
      $(`.btn${id}`).text("Update");
      this.SelectedComment        = "";
      this.SelectedCommentText    = "";
      this.ActivateUpdateBtn      = false;
      if(Time){
        $(`.time${id}`).text(Time);
      }
    }
  }

  OpenAddressModal(Address , Title , Phone){
    document.querySelector("#map-container").innerHTML = `<div id='map' style='width: 100%; height: 300px;'></div>`;
    if(Address.Longitude){
      this.Mapfound = true;
      this.buildmap(Address.Longitude , Address.Latitude);
      $("#map").css("max-height","1000px");
    }else{
      this.Mapfound = false;
      $("#map").css("max-height","0px");
    }
    this.AddressModal.open();
    $("#address__Title").text(Title);
    $("#address__Line1").text(Address.Line1);
    $("#address__Line2").text(Address.Line2);
    $("#address__Area").text(Address.Area);
    $("#address__City").text(Address.City);
    $("#address__Sate").text(Address.State);
    $("#address__Pincode").text(Address.Pincode);
    $("#address__Phonenumber").text(`For Contact - +91 ${Phone}`);
  }


  CalculateDistance(lat1, lon1, lat2, lon2){
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return `${ d.toFixed(2) + 3 } Km`;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }


  ChatPage(id){
    this.router.navigate(["chat",id]);
  }

  toast(text , classes = "#43a047 green darken-1"){
    M.toast({html: text , classes })
  }

}
