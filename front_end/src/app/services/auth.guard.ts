import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { EndpointsService } from './endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private urlPermisions = {
    ADMIN: ['*'],
    PROVEEDOR: ['']
  }

  constructor( private routes: Router, private Auth: AuthService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log("On guard",this.Auth.user)
      if (this.Auth.isLoggedIn$) {
        return true;
      } else {
        this.routes.navigate(['/']);
        return false;
      }
  }
  
}
