import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from './app.service';

import Web3 from 'web3';
import { WEB3 } from './web3.token';

import { User } from './signup.interface';

import { BabyjubjubService } from './lib/babyjubjub.service';

// import * as Bn from "bn.js";
import * as Bn from "bn.js";


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

  @ViewChild('fileInputLabel')
  fileInputLabel: ElementRef;

  constructor (
    @Inject(WEB3) private web3: Web3,
    private fb: FormBuilder,
    private appService: AppService,
    private babyjubjubService: BabyjubjubService
  ) {}

  async ngOnInit() {
    this.user = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      postcode: [''],
      city: [''],
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

    this.createPerdersen();

  }

  createPerdersen() {
    const inputs = [new Bn('1',10),new Bn('70',10),new Bn('20',10)];
    const secret = new Bn('101',10);    ;
    const ped = this.babyjubjubService.pedersenCommitment(inputs, secret);
    this.babyjubjubService.assertOnCurve(ped);
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
    formData.append('userUploadedFile', this.fileToUpload);

    formData.append('publicKey', this.publicKey);

    this.appService.uploadUserData(formData).subscribe(res => console.log(res));
 }

}
