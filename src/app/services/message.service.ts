import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const BASEURL = environment.BASEURL;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http : HttpClient) { }

  GetAllMessages(SenderId , ReceiverId):Observable<any>{
    return this.http.get(`${BASEURL}/chat-message/${SenderId}/${ReceiverId}`);
  }

  SendMessage(SenderId , ReceiverId , receiverName , message):Observable<any>{
    return this.http.post(`${BASEURL}/chat-message/${SenderId}/${ReceiverId}`,{
      receiverName,
      message
    })
  }
}
