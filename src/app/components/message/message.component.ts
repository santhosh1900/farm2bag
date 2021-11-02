import { Component, OnInit , AfterViewInit , ViewChild} from '@angular/core';
import { FormGroup , FormBuilder , Validator, Validators , FormControl } from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpService } from 'src/app/services/otp.service';
import { MessageService } from "../../services/message.service";
import { NgxAutoScroll } from "ngx-auto-scroll";
import * as moment from "moment";
import { io } from "socket.io-client";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit , AfterViewInit {

  MessageForm     : FormGroup;
  Nl              : any;
  Receiver        : any;
  ReceiverData    : any;
  Loader          = true;
  CurrentUser     = this.tokenservice.GetUserPayload();
  Messages        = [];
  socket          : any;

  constructor(
    private fb              : FormBuilder,
    private tokenservice    : TokenService,
    private route           : ActivatedRoute,
    private router          : Router,
    private userservice     : OtpService,
    private Messageservice  : MessageService
  ) {

        // this.socket = io('http://localhost:3000',{
    //   withCredentials: true,
    //   extraHeaders: {
    //   "my-custom-header": "abcd"
    //   }
    // });

    this.socket = io(environment.BASEURL);

  }

  ngOnInit(): void {
    this.Nl          = this.tokenservice.NewLine();
    this.MessageForm = this.fb.group({
      Message      : new FormControl('', Validators.required)
    });


    this.route.params.subscribe(params => {
      this.Receiver = params.id;
      this.GetUserById(this.Receiver);
    });

    this.socket.emit("create_room" , {
      room : this.tokenservice.GetUserPayload()._id
    });

    // this.socket.on('message_received', data =>{
    //   console.log(data)
    // });

    // // client-side
    // this.socket.on("hello", (arg) => {
    //   console.log(arg); // world
    // });

  }

  ngAfterViewInit(){
    
  }

  SubmitChatForm(){
    var message = this.MessageForm.value.Message;
    // d = d.replace(/\n/g , this.Nl.newline);
    this.Messageservice.SendMessage(this.CurrentUser._id , this.ReceiverData._id , this.ReceiverData.Username , message).subscribe(data => {
      this.Messages.push(data.new_message);
      console.log(data.new_message)
      this.socket.emit("send_new_message", data.new_message);
      // this.socket.emit("refresh", {});
    });
    this.MessageForm.reset();
  }

  GetUserById(id){
    this.userservice.GetUserById(id).subscribe(data => {
      this.ReceiverData = data;
      this.GetAllMessages();
    },err=>{
      this.toast("User Not Found" , "#e53935 red darken-1")
      this.router.navigate(["explore"])
    })
  }

  GetAllMessages(){
    this.Messageservice.GetAllMessages(this.ReceiverData._id , this.CurrentUser._id).subscribe(data => {
      this.Messages = data.messages.message;
      this.Loader = false;
    })
  }

  GetTime(time){
    return moment(time).fromNow();
  }


  toast(text , classes = "#43a047 green darken-1"){
    M.toast({html: text , classes })
  }

}
