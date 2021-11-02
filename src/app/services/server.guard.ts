import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { TokenService } from "./token.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerGuard implements CanActivate {
  constructor(private router : Router , private tokenService : TokenService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = this.tokenService.GetUserPayload();
      if(token.Admin){
        return true;
      }else{
        this.router.navigate(["/"]);
        return false;
      }
  }
  
}
