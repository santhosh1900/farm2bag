import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemsModule } from "./modules/items.module";
import { ItemsRoutingModule } from "./modules/items-routing.module";
import { ServerSideRoutingModule } from "./modules/server-side-routing.module";
import { ServerSideModule } from "./modules/server-side.module";
import { SellerModule} from "./modules/seller.module";
import { SellerSideRoutingModule} from "./modules/seller-side-routing.module";


import { CookieService } from "ngx-cookie-service";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from "./services/token-interceptor";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ItemsModule,
    ItemsRoutingModule,
    ServerSideModule,
    ServerSideRoutingModule,
    SellerModule,
    SellerSideRoutingModule
  ],
  providers: [CookieService,
    {
      provide : HTTP_INTERCEPTORS, 
      useClass : TokenInterceptor, 
      multi : true
    } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
