import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { EndpointsService } from '../services/endpoints.service';

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
  username: string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private edp: EndpointsService) { }

  ngOnInit(): void {
    this.edp.currentUser().subscribe(
      user => {
        this.username = user.razon_social;
      }
    )
  }

}
