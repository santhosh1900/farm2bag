import { Component, OnInit , OnChanges , SimpleChanges , Input } from '@angular/core';
import { TokenService } from "../../services/token.service";
import { AduploadService } from "../../services/adupload.service"; 
import * as M from "materialize-css";
import { FormGroup , FormBuilder , FormControl , Validator, Validators } from '@angular/forms';
import * as moment from "moment";
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as $ from "jquery";

@Component({
  selector: 'app-farmer-ads',
  templateUrl: './farmer-ads.component.html',
  styleUrls: ['./farmer-ads.component.css']
})
export class FarmerAdsComponent implements OnInit {

  City                  : String;
  Loader                = true;
  FarmersAds            : any;
  CurrentUser           = this.tokenservice.GetUserPayload();
  CommentForm           : FormGroup; 
  @Input() Location     = String;
  @Input() Delay        = String;
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



  constructor(
    private tokenservice : TokenService,
    private AdService    : AduploadService,
    private fb           : FormBuilder,
    private router       : Router
  ) { }

  ngOnInit(): void {
    this.InitLocation();
    this.InitCommentForm();

  }

  ngOnChanges(changes:SimpleChanges) : void{
    if(!changes.Delay){
      this.GetAllFarmersAds(this.Location);
    }
    this.Delay + '' == "Delay" ? this.DelayLoader = true : this.DelayLoader = false;
  }


  InitLocation(){
    this.tokenservice.GetLocation() ? this.City = this.tokenservice.GetLocation() : this.City = "Chennai";
    this.GetAllFarmersAds(this.City);
  }

  GetAllFarmersAds(City){
    this.AdService.GetAllFarmersAds(City).subscribe(data => {
      this.FarmersAds = data.ALLFarmerAds;
      this.Loader = false;
      $("#holder").css("position","fixed");
      setTimeout(()=>{
        this.InitToolTip();
      },1000);
    })
  }

  InitToolTip(){
    var is_mobile = this.checker();
    if(!is_mobile){
      var elems = document.querySelectorAll('.tooltipped');
      M.Tooltip.init(elems, {});
    }
    var tab   = document.querySelectorAll('.tabs');
    M.Tabs.init(tab, {});

    this.Modal = document.querySelector('.CommentModels');
    M.Modal.init(this.Modal, {});
    this.ModalInstances = M.Modal.getInstance(this.Modal);
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
    this.AdService.GetALLFarmerAdComments(this.SelectedAd).subscribe(data => {
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
    this.AdService.AddViewToFarmer(id).subscribe(data => {
      console.log(data);
      this.IncreaseTheView(id)
    })
  }


  IncreaseTheView(id){
    this.FarmersAds.forEach(ad => {
      if(ad._id == id){
        var user = {
          User : this.CurrentUser._id,
          _id  : "343423441231dsfafaf"
        }
        ad.Views.push(user);
        this.toast("Ad is Marked as Viewed")
        return ad.ViewsCount++
      }
    });
  };

  IncreaseTheCommentCount(id){
    this.FarmersAds.forEach(ad => {
      if(ad._id == id){
        this.toast("Your Comment is Posted")
        return ad.CommentsCount++;
      }
    });
  };

  DecreaseTheCommentCount(id){
    this.FarmersAds.forEach(ad => {
      if(ad._id == id){
        this.toast("Your Comment is Deleted")
        return ad.CommentsCount--;
      }
    });
  }


  CheckInViews(arr , id){
    return _.some(arr , { User : id });
  }


  toast(text , classes = "#43a047 green darken-1"){
    M.toast({html: text , classes })
  }

  checker(){
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if(isMobile){
      return true;
    }else{
      return false
    }
  }

  InitCommentForm(){
    this.CommentForm = this.fb.group({
      Comment    : new FormControl( "" , Validators.required)
    });
  }

  SubmitForm(){
    this.CommentBtnClicked  = true;
    this.AdService.AddFarmAdComment(this.CommentForm.value , this.SelectedAd).subscribe(data => {
      this.PushComment(data.Created_comment);
      this.CommentForm.reset();
      this.IncreaseTheCommentCount(this.SelectedAd);
      this.CommentBtnClicked = false
    })
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

  DeleteComment(id){
    this.AdService.DeleteFarmerAdComments(id , this.CurrentUser._id , this.SelectedAd).subscribe(data => {
      _.remove(this.CommentsArray, (n : any) => n._id == id);
      this.DecreaseTheCommentCount(this.SelectedAd);
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
      // this.InitTextArea(0);
      M.textareaAutoResize($(`.${InputClassName}`));
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
  };

  ChatPage(id){
    this.router.navigate(["chat",id]);
  }



}
