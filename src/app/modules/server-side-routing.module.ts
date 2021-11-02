import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes , RouterModule } from "@angular/router";
import { DragScrollModule } from 'ngx-drag-scroll';

import { ServerSideComponent } from "../components/server-side/server-side.component";

import { ServerGuard } from "../services/server.guard";

const routes : Routes = [
  {
    path : "ServerSide",
    component : ServerSideComponent,
    canActivate : [ServerGuard]
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
export class ServerSideRoutingModule { }
