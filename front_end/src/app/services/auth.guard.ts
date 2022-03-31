import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EndpointsService } from './endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private urlPermisions = {
    ADMIN: ['*'],
    PROVEEDOR: ['']
  }

  constructor( private routes: Router, private edp: EndpointsService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (localStorage.getItem('session') != null) {
        this.edp.currentUser().subscribe(
          current => {
            if (current.Rol.rol = 'Admin'){
              console.log('Is Admin', state.url);
            }else{
              console.log('Is Proveedor', state.url);
            }
          },
          expireSession => {
            this.routes.navigate(['/']);
            return false
            
          }
        )
        return true;
      } else {
        this.routes.navigate(['/']);
        return false;
      }
  }
  
}
