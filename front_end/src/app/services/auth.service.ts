import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { EndpointsService } from './endpoints.service';

export interface AuthState {
  isLoggedIn: boolean;
  user: Object | null;
}

const initialAuthState:any = {
  isLoggedIn: false,
  user: null,
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {




  private readonly authState = new BehaviorSubject<AuthState>(initialAuthState);

  /** AuthState as an Observable */
  readonly auth$ = this.authState.asObservable();

  /** Observe the isLoggedIn slice of the auth state */
  readonly isLoggedIn$ = this.auth$.pipe(map(state => state.isLoggedIn));
  loggedIn: boolean;
  user: any

  constructor(private edp: EndpointsService, private router: Router,) {
     
    
  }

  setUser(U: any){
    if (!U) {
      return;
    }
      console.log('on set user', U);
    this.loggedIn = true;
    this.user = U;
    localStorage.setItem('user', U.token)
    this.authState.next({isLoggedIn: true, user: U});
  }

  logOut() {
    this.loggedIn = false;
    this.authState.next(initialAuthState);
    this.router.navigate(['/'])
  }

  logIn(rfc: string, password: string) {
    return new Promise((resolve, reject) => {
      this.edp.login({rfc:rfc, password:password}).subscribe(
        susses => {
          console.log("Sing In", susses)
          this.setUser(susses)
          resolve(susses)
        },
        error => {
          console.log("FailError",error);
          reject(error)
        }
      )
    })

    
  }

  UserInfo(){
    this.edp.currentUser().subscribe(
      doIn => {
        let token = localStorage.getItem('user');
        if(token){
          doIn.token = token
          this.setUser(doIn)
        }
        
        console.log("HERE",doIn)},
      fail => { 
        this.logOut();
        console.log(fail)
      }
    )
  }
}
