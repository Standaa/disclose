import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from './app.service';

import Web3 from 'web3';
import { WEB3 } from './web3.token';

import { User } from './signup.interface';

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
    private appService: AppService
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

    this.appService.uploadUserData(formData).subscribe(res => console.log(res));
 }

}
