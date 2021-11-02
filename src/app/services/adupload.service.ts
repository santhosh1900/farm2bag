import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const BASEURL = environment.BASEURL;


@Injectable({
  providedIn: 'root'
})
export class AduploadService {

  constructor(private http : HttpClient) {}

  PostFarmerAd(body , ImgURL , ImgId , VideoURL = "" , VideoId = "" ): Observable<any> {
    return this.http.post(`${BASEURL}/submitfarmerad`,{
      body,
      ImgURL,
      ImgId,
      VideoId,
      VideoURL
    });
  };

  GetUserAds():Observable<any> {
    return this.http.get(`${BASEURL}/getuserads`);
  };

  DeleteFarmerAd():Observable<any> {
    return this.http.delete(`${BASEURL}/deletefarmerad`);
  }

  PostWholeSaleAd(body , ImgURL , ImgId , VideoURL = "" , VideoId = "" , proffURL , proffId , Longitude = 0 , Latitude = 0 ):Observable<any> {
    return this.http.post(`${BASEURL}/submitwholesalead`,{
      body,
      ImgURL,
      ImgId,
      VideoId,
      VideoURL,
      proffId,
      proffURL,
      Longitude,
      Latitude
    });
  };
  
  DeleteWholesaleAd():Observable<any> {
    return this.http.delete(`${BASEURL}/deletewholesalead`);
  }

  GetFarmAd():Observable<any>{
    return this.http.get(`${BASEURL}/getFarmad`);
  }

  UpdateFarmAd(body , ImageId = "" , ImageUrl = "" , VideoId = "" , VideoUrl = ""):Observable<any>{
    return this.http.put(`${BASEURL}/updatefarmad`,{
      body , 
      ImageId,
      ImageUrl,
      VideoId,
      VideoUrl
    })
  };

  GetWholesaleAd():Observable<any>{
    return this.http.get(`${BASEURL}/getwholesalead`);
  }

  UpdateWholesaleAdPoster(ImageId , ImageUrl):Observable<any>{
    return this.http.put(`${BASEURL}/updatewholesaleadposter`,{
      ImageId,
      ImageUrl
    })
  }

  UpdateWholesaleAdProff(ImageId , ImageUrl):Observable<any>{
    return this.http.put(`${BASEURL}/updatewholesaleadadproff`,{
      ImageId,
      ImageUrl
    })
  }

  UpdateWholesaleAdVideo(VideoId , VideoUrl):Observable<any>{
    return this.http.put(`${BASEURL}/updatewholesaleadvideo`,{
      VideoId,
      VideoUrl
    })
  }


  UpdateWholesaleAd(body) : Observable<any>{
    return this.http.put(`${BASEURL}/updatewholesalead`,{
      body
    })
  }

  GetAllFarmersAds(location) : Observable<any>{
    return this.http.get(`${BASEURL}/getallfarmerads/${location}`);
  }

  GetAllWholesaleAds(location) : Observable<any>{
    return this.http.get(`${BASEURL}/getallwholesaleads/${location}`);
  }

  AddViewToFarmer(Id) : Observable<any>{
    return this.http.post(`${BASEURL}/addfarmerview`,{
      Id
    });
  }


  AddViewToWholesale(Id) : Observable<any>{
    return this.http.post(`${BASEURL}/addwholesaleview`,{
      Id
    });
  }

  AddFarmAdComment(body , FarmerId):Observable<any>{
    return this.http.post(`${BASEURL}/postfarmadcomment`,{
      body,
      FarmerId
    })
  }

  GetALLFarmerAdComments(FarmerId):Observable<any>{
    return this.http.get(`${BASEURL}/getallfarmeradcomments/${FarmerId}`)
  }


  DeleteFarmerAdComments(CommentId , UserId , FarmAdId):Observable<any>{
    return this.http.delete(`${BASEURL}/deletefarmadcomment/${CommentId}/${UserId}/${FarmAdId}`)
  }

  UpdateComment(CommentId , Text , CurrentUserId):Observable<any>{
    return this.http.put(`${BASEURL}/updatecomment`,{
      CommentId,
      Text,
      CurrentUserId
    })
  }

  GetAllWholesaleAdComment(Id):Observable<any>{
    return this.http.get(`${BASEURL}/getallwholesaleadcomments/${Id}`)
  }

  AddWholesaleAdComment(body , WholesaleAdId):Observable<any>{
    return this.http.post(`${BASEURL}/postwholesaleadcomment`,{
      body,
      WholesaleAdId
    })
  }

  DeleteWholesaleAdComments(CommentId , UserId , WholesaleAdId):Observable<any>{
    return this.http.delete(`${BASEURL}/deletewholesaleadcomment/${CommentId}/${UserId}/${WholesaleAdId}`)
  }



}
