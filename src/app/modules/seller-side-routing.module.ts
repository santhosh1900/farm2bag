import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes , RouterModule } from "@angular/router";
import { DragScrollModule } from 'ngx-drag-scroll';

import { SellProductComponent } from "../components/sell-product/sell-product.component";
import { AdEditPageComponent } from "../components/ad-edit-page/ad-edit-page.component";
import { ProductadEditPageComponent } from "../components/productad-edit-page/productad-edit-page.component";
import { AuthGuard } from '../services/auth.guard';

const routes : Routes = [
  {
    path : "Farm2backSellProduct",
    component : SellProductComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "FarmerAdEdit",
    component : AdEditPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path : "WholesaleAdEdit",
    component : ProductadEditPageComponent,
    canActivate : [AuthGuard]
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
export class SellerSideRoutingModule { }
