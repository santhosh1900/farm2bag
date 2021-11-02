import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes , RouterModule } from "@angular/router";

import { AllitemsComponent } from '../components/allitems/allitems.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { ItemShowComponent } from "../components/item-show/item-show.component";
import { CartPageComponent } from '../components/cart-page/cart-page.component';
import { AuthGuard } from "../services/auth.guard";
import { ProfileComponent } from "../components/profile/profile.component"; 
import { AddressformComponent } from "../components/addressform/addressform.component";
import { CheckoutComponent } from "../components/checkout/checkout.component";
import { ExploreWorldComponent } from "../components/explore-world/explore-world.component";
import { ChatbotComponent } from "../components/chatbot/chatbot.component";
import { DummyGuard } from "../services/dummy.guard";
import { ChatComponent } from '../components/chat/chat.component';

const routes : Routes = [
  {
    path : "",
    component : AllitemsComponent,
    canActivate : [DummyGuard]
  },
  {
    path : "product/:id",
    component : ItemShowComponent,
    canActivate : [DummyGuard]
  },
  {
    path : "cartpage",
    component : CartPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "myprofile",
    component : ProfileComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "addressform",
    component : AddressformComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "editaddressform/:id",
    component : AddressformComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "checkout",
    component : CheckoutComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "explore",
    component : ExploreWorldComponent,
    canActivate : [AuthGuard]
  },{
    path : "contactfarm2bagteam",
    component : ChatbotComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "chat/:id",
    component : ChatComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "*",
    component : AllitemsComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DragScrollModule,
    RouterModule.forRoot(routes)],
    exports : [RouterModule]
})
export class ItemsRoutingModule { }
