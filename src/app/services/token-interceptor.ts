import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenService } from "./token.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor( private tokenService : TokenService) {}
    intercept(req : HttpRequest<any> , next : HttpHandler) : Observable<HttpEvent<any>> {
        const headersConfig = {
            "Content-Type" : "application/json",
            "Accept"    : "application/json"
        };
        const token = this.tokenService.GetUserToken();
        if(token) {
            headersConfig["Authorization"] = `fArM2BaGSanDy ${token}`;
        }else{
            headersConfig["Authorization"] = `fArM2BaGSanDy`;
        }
        const _req = req.clone({ setHeaders : headersConfig });
        return next.handle(_req);
    }
};

