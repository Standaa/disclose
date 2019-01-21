import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from './app.service';

import Web3 from 'web3';
import { WEB3 } from './web3.token';

import { User } from './signup.interface';

import { BabyjubjubService } from './lib/babyjubjub.service';
import { WindowRefService, ICustomWindow } from './lib/window.ref.service';

// import * as Bn from "bn.js";
import * as Bn from "../../node_modules/bn.js/lib/bn.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'disclose';
  publicKey: string = '';
  fileToUpload: File;
  user: FormGroup;

  window: ICustomWindow;

  @ViewChild('fileInputLabel')
  fileInputLabel: ElementRef;

  constructor (
    @Inject(WEB3) private web3: Web3,
    private fb: FormBuilder,
    private appService: AppService,
    private babyjubjubService: BabyjubjubService,
    private windowRef: WindowRefService
  ) {
    this.window = windowRef.nativeWindow;
  }

  async ngOnInit() {
    this.user = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      postcode: [''],
      city: [''],
      country: [''],
      age: [''],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      fileToUpload: ['', [Validators.required]]
    });

    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
    }

    const accounts = await this.web3.eth.getAccounts();

    if (accounts) {
      this.publicKey = accounts[0];
      console.log(accounts, accounts[0]);
    } else {
      console.log('Please Install Metamask and create an account noob');
    }

  }

  onFileChange(files: FileList) {
    this.fileInputLabel.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }

  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    console.log(value, valid);

    let formData: FormData = new FormData();
    console.log('value', value.firstName);
    formData.append('firstName', value.firstName);
    formData.append('lastName', value.lastName);
    formData.append('email', value.email);
    formData.append('country', value.country);
    formData.append('age', value.age.toString());
    formData.append('userUploadedFile', this.fileToUpload);

    formData.append('publicKey', this.publicKey);

    this.createPerdersen(formData);

    // this.appService.uploadUserData(formData).subscribe(res => console.log(res));
  }

   createPerdersen(formData) {
     const random_num = new Uint8Array(253 / 8); // 2048 = number length in bits
     const sec = this.window.crypto.getRandomValues(random_num);

     let inputs = [];
     for(var pair of formData.entries()) {
       if (pair[0] !== "userUploadedFile") {
         console.log(pair[1]);
         inputs.push(new Bn(pair[1], 10));
       }
     }

     const secret = new Bn(sec.toString(), 10);
     const ped = this.babyjubjubService.pedersenCommitment(inputs, secret);
     this.babyjubjubService.assertOnCurve(ped);
   }


}
