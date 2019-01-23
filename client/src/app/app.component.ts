import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Web3 from 'web3'; // tslint:disable-line
import * as zkSnark from "snarkjs"; // tslint:disable-line
import { stringifyBigInts, unstringifyBigInts } from "snarkjs/src/stringifybigint.js"; // tslint:disable-line

import { FileImportService } from './../crypto/file.import.service';
import { AppService } from './app.service';

import { WEB3 } from './web3.token';
import { User } from './signup.interface';

import { AppHelperService } from './helpers/app.helper.service';

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

  loader = false;

  secret: string;
  inputs: any;

  formData: any;
  proofStr: any;
  publicSignalsStr: string;

  @ViewChild('fileInputLabel')
  fileInputLabel: ElementRef;

  constructor (
    @Inject(WEB3) private web3: Web3,
    private fb: FormBuilder,
    private appService: AppService,
    private appHelperService: AppHelperService,
    private fileImportService: FileImportService
  ) {}

  ngOnInit() {
    this.configureForm();
    // this.initMetamask();
  }

  configureForm () {
    this.user = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      postcode: [''],
      city: [''],
      country: [''],
      age: [''],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      fileToUpload: ['']
    });
  }

  async initMetamask() {
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

  async onSubmit({ value }: { value: User }) {
    this.loader = true;
    try {
      this.setFormData(value);
      this.setZkProofInputs();
      const circuitAndProvingKeyArr = await this.retrieveCircuitAndProvingKey();
      await this.createProof(circuitAndProvingKeyArr);
      this.uploadInfomations();
    } catch (err) {
      console.log(err);
    }
    this.loader = false;
  }

  setFormData (formValues: User) {
    this.formData = new FormData();
    this.formData.append('firstName', formValues.firstName);
    this.formData.append('lastName', formValues.lastName);
    this.formData.append('email', formValues.email);
    // this.formData.append('country', formValues.country);
    // this.formData.append('age', formValues.age.toString());
    // formData.append('userUploadedFile', this.fileToUpload);
  }

  setZkProofInputs() {
    this.secret = this.appHelperService.random(6);
    this.inputs = [];
    for(var pair of this.formData.entries()) {
      if (pair[0] !== "userUploadedFile") {
        let shortHexFormValue = this.appHelperService.str2Hex(pair[1]).slice(-16);
        let intShortHexFormValue= parseInt(shortHexFormValue, 16);
        let bigIntFormValueRepresentation = zkSnark.bigInt(intShortHexFormValue);
        this.inputs.push(bigIntFormValueRepresentation);
      }
    }
  }

  retrieveCircuitAndProvingKey() {
    return new Promise((resolve, reject) => this.fileImportService.getZkCircuitAndProvingKey().subscribe(resolve, reject));
  }

  createProof(circuitAndProvingKeyArr) {
    return new Promise((resolve, reject) => {
      try {
        const provingKey = unstringifyBigInts(circuitAndProvingKeyArr[1]);
        const circuit = new zkSnark.Circuit(circuitAndProvingKeyArr[0]);
        const witness = circuit.calculateWitness({ 'in': this.inputs, 'priv': this.secret });
        console.log(new Date(), 'Generating proof');
        const {proof, publicSignals} = zkSnark.groth.genProof(provingKey, witness);
        console.log(new Date(), 'Done.');
        this.proofStr = JSON.stringify(stringifyBigInts(proof));
        this.publicSignalsStr = JSON.stringify(stringifyBigInts(publicSignals));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  uploadInfomations() {
    this.formData.append('proofStr', this.proofStr);
    this.formData.append('publicSignalsStr', this.publicSignalsStr);
    return this.appService.uploadUserInformationsToAuthority(this.formData).toPromise();
  }

  onFileChange(files: FileList) {
    this.fileInputLabel.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }

}
