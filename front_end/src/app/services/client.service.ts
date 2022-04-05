import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";



@Injectable({
    providedIn: 'root'
})
export class JwtTokenInterceptor implements HttpInterceptor {
    authState :any;
    constructor(private Auth: AuthService) {
        this.Auth.auth$.subscribe(U => this.authState = U)
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // add Authorization header with jwt token if account is logged in.        
        const isLoggedIn:boolean|null = this.Auth.loggedIn
        console.log("CLIENT",this.authState)
        if (isLoggedIn) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${this.authState.user.token}` }
            });
        }

        return next.handle(request);
    }
} 