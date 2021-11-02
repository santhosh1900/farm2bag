import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ServerSideComponent } from '../components/server-side/server-side.component';
import { ServerNavComponent } from '../components/server-nav/server-nav.component';

import { ServerService } from "../services/server.service";




@NgModule({
  declarations: [ServerSideComponent, ServerNavComponent],
  imports: [
    CommonModule
  ],
  exports : [
    ServerSideComponent
  ],
  providers : [ServerService]
})
export class ServerSideModule { }
