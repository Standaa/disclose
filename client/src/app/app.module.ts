import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import Web3 from 'web3';

import { BabyjubjubService } from './lib/babyjubjub.service';
import { WindowRefService } from './lib/window.ref.service';

// Create an Injection Token with web3 inside
export const WEB3 = new InjectionToken<Web3>('web3');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    BabyjubjubService,
    WindowRefService,
    { provide: WEB3,
    useFactory: () => new Web3(Web3.givenProvider || "ws://localhost:8546")
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
