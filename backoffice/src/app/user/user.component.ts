import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from './../app.service';
import { SharedService } from './../shared.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

  user: any;
  img: any;

  constructor(
    private sharedService: SharedService,
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('ngOnInit user');    
    this.user = this.sharedService.getUser();
    var buf = this.user.idProof[0].buffer;
    this.img = 'data:image/jpeg;base64,' + buf.toString('base64');
    console.log(this.user);
  }

  ngAfterViewInit(): void {
    // this.sharedService.emitLoadingChange(false);
  }

  setUserVerified() {
    this.sharedService.emitLoadingChange(true);
    this.appService.setUserVerified(this.user._id).subscribe((result) => {
      this.router.navigate(['/list']);
    });
  }

  cancel () {
    this.sharedService.emitLoadingChange(true);
    this.router.navigate(['/list']);
  }

}
