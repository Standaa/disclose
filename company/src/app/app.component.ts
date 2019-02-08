import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';

import { WEB3 } from './web3.token';
import Web3 from 'web3'; // @ts-ignore

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'company';
  uploadedFile: any;
  reader = new FileReader();

  publicKey: any;

  @ViewChild('fileInputLabel')
  fileInputLabel: ElementRef;

  constructor (
    @Inject(WEB3) private web3: Web3
  ) {}

  ngOnInit() {
    this.initMetamask();
  }

  onFileChange(files: FileList) {
    this.fileInputLabel.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.uploadedFile = files.item(0);

    this.reader.readAsText(this.uploadedFile);
    this.reader.onload = this.readSuccess;

    console.log('file', this.uploadedFile);
  }

  readSuccess(evt) {
    let jsonData = JSON.parse(evt.target.result);
    console.log(jsonData);
    // console.log(jsonData.signedData);
  }

  async initMetamask() {
    console.log(this.web3.currentProvider);
    try {
        // @ts-ignore
        await ethereum.enable();
        const accounts = await this.web3.eth.getAccounts();
        console.log(accounts);
    } catch (error) {
      console.log('error', error);
    }

    // if (accounts) {
    //   this.publicKey = accounts[0];
    //   console.log(accounts, accounts[0]);
    // } else {
    //   console.log('Please Install Metamask and create an account noob');
    // }

    const companyAbi: any = [{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"label","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setSubnodeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"ttl","outputs":[{"name":"","type":"uint64"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"label","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"ttl","type":"uint64"}],"name":"NewTTL","type":"event"}];

    const company = new this.web3.eth.Contract(companyAbi, '0x112234455c3a32fd11230c42e7bccd4a84e02010');

    // const subDomainAddress = await company.methods.owner(namehash("stas.volya.test")).call();
    // console.log("Result", subDomainAddress);

    // const functionAbi = ens.methods.setSubnodeOwner(namehash('volya.test'), web3.utils.sha3('stas'), '0x320d52bb26D9982096b3eF02Cb9c22836bEc1E82').encodeABI();

    // web3.eth.getGasPrice()
    // .then((gasAmount) => {
    //   gasAmount *= 2;
    //   gasAmount = Math.floor(gasAmount);
    //
    //   web3.eth.getTransactionCount(account).then(_nonce => {
    //     nonce = _nonce.toString(16);
    //
    //     const txParams = {
    //       gasPrice: web3.utils.toHex(gasAmount),
    //       gasLimit: web3.utils.toHex(99000),
    //       to: '0x112234455C3a32FD11230C42E7Bccd4A84e02010',
    //       data: functionAbi,
    //       from: web3.eth.defaultAccount,
    //       nonce: '0x' + nonce,
    //     }
    //
    //     console.log(txParams);
    //
    //     const tx = new EthereumTx(txParams);
    //     tx.sign(PRIVATE_KEY);
    //
    //     const serializedTx = tx.serialize();
    //
    //     web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log)
    //
    //   }).catch(e => console.log(e));
    // });

  }


}
