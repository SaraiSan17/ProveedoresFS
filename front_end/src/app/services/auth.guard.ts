import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, NavigationEnd, Event } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { EndpointsService } from './endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private urlPermisions = {
    ADMIN: ['*'],
    PROVEEDOR: ['/home', '/facturacion']
  }

  constructor(private routes: Router, private Auth: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log("On guard", this.Auth.user)
    let inRoute = false;
    if (this.Auth.isLoggedIn$) {
      console.log("ROL", this.Auth.user?.Rol.rol)
      if (this.Auth.user?.Rol.rol == "ADMIN") {
        console.log("IS ADMIN")
        inRoute = true;
      } else {
        let from = this.routes.routerState.snapshot.url;
        console.log("from", from)
        this.routes.events.subscribe((event: Event) => {

          if (this.Auth.user?.Rol.rol != "ADMIN" && event instanceof NavigationEnd) {
            console.log(event.url)
            console.log(event);


            if ( this.urlPermisions.PROVEEDOR.includes(event.url)) {
              inRoute = true;
            } else {
              inRoute = false
              this.routes.navigate([from]);
            }
          }
        })

      }

      return true;
    } else {
      this.routes.navigate(['/']);
      return false;
    }
  }

}
