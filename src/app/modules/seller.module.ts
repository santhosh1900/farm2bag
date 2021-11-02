import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FileUploadModule } from "ng2-file-upload";
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SellProductComponent } from "../components/sell-product/sell-product.component";
import { SellnavComponent } from '../components/sellnav/sellnav.component';
import { SellercardsComponent } from '../components/sellercards/sellercards.component';
import { ProductformComponent } from '../components/productform/productform.component';
// import { ReactiveFormsModule } from '@angular/forms';

import { TokenService } from "../services/token.service";
import { AduploadService } from "../services/adupload.service";
import { AdEditPageComponent } from '../components/ad-edit-page/ad-edit-page.component';
import { ProductadEditPageComponent } from '../components/productad-edit-page/productad-edit-page.component';



@NgModule({
  declarations: [SellProductComponent, SellnavComponent, SellercardsComponent, ProductformComponent, AdEditPageComponent, ProductadEditPageComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  exports : [
    SellProductComponent,    
  ],
  providers : [TokenService , AduploadService]
})
export class SellerModule { }
