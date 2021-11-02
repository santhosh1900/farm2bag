import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class DummyGuard implements CanActivate {
  constructor (private router : Router , private tokenService : TokenService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.tokenService.GetUserPayload();
    if(token && !token.Admin) {
      return true;
    }
    else if (token && token.Admin){
      this.router.navigate(["/ServerSide"]);
      return false;
    }
    else{
      return true;
    }
  }
  
}
