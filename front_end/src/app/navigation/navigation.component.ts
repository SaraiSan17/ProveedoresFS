import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { EndpointsService } from '../services/endpoints.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  showFiller = false;
  navHide = false;
  iconMenu = 'chevron_right';
  panelOpenState = false;
  user: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
  authState :any;
  constructor(private breakpointObserver: BreakpointObserver,
    private Auth: AuthService) { 
      this.Auth.auth$.subscribe(U => this.authState = U)
    }

  ngOnInit(): void {
    this.Auth.UserInfo();
    this.user = this.authState.user;
  }

  logout(){
    this.Auth.logOut()
  }

}
