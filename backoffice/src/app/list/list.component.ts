import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SharedService } from './../shared.service';
import { AppService } from './../app.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {


  users$: any; //Observable<[]>;
  hasResults: boolean;

  constructor (
    private sharedService: SharedService,
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit List');
    this.sharedService.emitLoadingChange(true);
    this.users$ = this.appService.getUsersPendingVerification();

    this.users$.subscribe(data => {
      setTimeout(() => { this.sharedService.emitLoadingChange(false) }, 900); // Temp solution because angular does not provide a hook to detect when ngFor as finished loading.
      console.log('Received off');
      if (data && data.length > 0) {
        this.hasResults = true;
      } else {
        this.hasResults = false;
      }
    });
  }

  navigateTo(user) {
    this.sharedService.setUser(user);
    this.router.navigate(['/user']);
  }

}
