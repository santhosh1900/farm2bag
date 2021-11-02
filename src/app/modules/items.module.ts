import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import {AllitemsComponent} from "../components/allitems/allitems.component";
import { FormsModule , ReactiveFormsModule } from "@angular/forms";
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SigninComponent } from '../components/signin/signin.component';
import { LoginComponent } from '../components/login/login.component';
import { LocationService } from "../services/location.service";
import { TokenService } from "../services/token.service";
import { ItemShowComponent } from '../components/item-show/item-show.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ScrollTopComponent } from '../components/scroll-top/scroll-top.component';
import { CartPageComponent } from '../components/cart-page/cart-page.component';
import { OtpService } from "../services/otp.service";
import { ProfileComponent } from '../components/profile/profile.component';
import { AccountinfoComponent } from '../components/accountinfo/accountinfo.component';
import { ProfilepageloaderComponent } from '../components/profilepageloader/profilepageloader.component';
import { AddressformComponent } from '../components/addressform/addressform.component';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { PreviousCartComponent } from '../components/previous-cart/previous-cart.component';
import { ExploreWorldComponent } from '../components/explore-world/explore-world.component';
import { ExploreWorldUserSideComponent } from '../components/explore-world-user-side/explore-world-user-side.component';
import { FarmerAdsComponent } from '../components/farmer-ads/farmer-ads.component';
import { WholesaleAdsComponent } from '../components/wholesale-ads/wholesale-ads.component';
import { ChatbotComponent } from '../components/chatbot/chatbot.component';
import { ChatComponent } from '../components/chat/chat.component';
import { MessageComponent } from '../components/message/message.component';
import { MessageService } from "../services/message.service";
import { NgxAutoScrollModule } from 'ngx-auto-scroll';


@NgModule({
  declarations: [AllitemsComponent, NavbarComponent, SigninComponent, LoginComponent, ItemShowComponent, LoaderComponent, FooterComponent, ScrollTopComponent, CartPageComponent, ProfileComponent, AccountinfoComponent, ProfilepageloaderComponent, AddressformComponent, CheckoutComponent, PreviousCartComponent, ExploreWorldComponent, ExploreWorldUserSideComponent, FarmerAdsComponent, WholesaleAdsComponent, ChatbotComponent, ChatComponent, MessageComponent],
  imports: [
    CommonModule, 
    HttpClientModule , 
    FormsModule , 
    ReactiveFormsModule,
  ],
  exports : [
    AllitemsComponent,
    ItemShowComponent,
    CartPageComponent,
    ProfileComponent,
    AddressformComponent,
    AddressformComponent,
    CheckoutComponent,
    NgxAutoScrollModule
  ],
  providers : [LocationService , TokenService , OtpService , MessageService ]
})
export class ItemsModule { }
