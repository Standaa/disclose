import { Component } from '@angular/core';

import { SharedService } from './shared.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'backoffice';
  loader = true;

  constructor (
    private sharedService: SharedService,
    private router: Router
  ) {

    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        if (event.url === '/user') this.loader = false;
      }
    });

    this.sharedService.loadingChangeEmitted$.subscribe(isLoading => {
      this.loader = isLoading;
    });
  }

}
