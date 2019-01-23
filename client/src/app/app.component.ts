import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Web3 from 'web3';
import * as zkSnark from "snarkjs";
import { stringifyBigInts, unstringifyBigInts } from "snarkjs/src/stringifybigint.js";

import { BabyjubjubService } from './services/babyjubjub.service';
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
  zkData: {};

  @ViewChild('fileInputLabel')
  fileInputLabel: ElementRef;

  constructor (
    @Inject(WEB3) private web3: Web3,
    private fb: FormBuilder,
    private appService: AppService,
    private appHelperService: AppHelperService,
    private babyjubjubService: BabyjubjubService,
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

  setFormData (formValues: User) {
    this.formData = new FormData();
    this.formData.append('firstName', formValues.firstName);
    this.formData.append('lastName', formValues.lastName);
    this.formData.append('email', formValues.email);
    // this.formData.append('country', formValues.country);
    // this.formData.append('age', formValues.age.toString());
    // formData.append('userUploadedFile', this.fileToUpload);
  }

  async onSubmit({ value }: { value: User }) {
    this.loader = true;
    console.log(value);
    // const ped = await this.createPerdersen(formData);
    this.setFormData(value);
    this.setInputs();
    await this.createProof();
    // this.uploadInfomations();
  }

  async setInputs() {

    // this.secret = zkSnark.bigInt(sec);
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

  async createProof() {
    this.fileImportService.getZkCircuitAndProvingKey().subscribe( ([vk_verifier, vk_proof]) => {
      const provingKey = unstringifyBigInts(vk_proof);
      const circuit = new zkSnark.Circuit(vk_verifier);
      console.log('this inputs', this.inputs);
      console.log('this.secret', this.secret);
      console.log('circuit', circuit);
      const witness = circuit.calculateWitness({ 'in': this.inputs, 'priv': this.secret });
      // const witness = circuit.calculateWitness({ in: [zkSnark.bigInt("1018983982094839844893290842399423809480983948293574389082"), zkSnark.bigInt("1018983982094839844893290842399423809480983948293574389082"), zkSnark.bigInt("1018983982094839844893290842399423809480983948293574389082")], priv: this.secret });
      // const witness = circuit.calculateWitness({ "in": ["1", "70", "20"], "priv":"101" });
      console.log(new Date(), 'Generating proof');
      const {proof, publicSignals} = zkSnark.groth.genProof(provingKey, witness);
      console.log(new Date(), 'Done.');
      this.loader = false;
    });
  }

  uploadInfomations() {
    this.formData.append('zkData', this.zkData);
    this.appService.uploadUserInformationsToAuthority(this.formData);
  }

  onFileChange(files: FileList) {
    this.fileInputLabel.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }

}
