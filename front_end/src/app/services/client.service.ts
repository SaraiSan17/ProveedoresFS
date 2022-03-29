import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class JwtTokenInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // add Authorization header with jwt token if account is logged in.        
        const isLoggedIn:string|null = localStorage.getItem('session') ;
       
        if (isLoggedIn != null) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${isLoggedIn}` }
            });
        }

        return next.handle(request);
    }
} 