import { InjectionToken } from '@angular/core';
import Web3 from 'web3';

export const WEB3 = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => {
    try {
      // const rpcURL = "https://rinkeby.infura.io/v3/ef0402bc01c4448c9e8ad28c126af0dd";
      const provider = ('ethereum' in window) ? window['ethereum'] : Web3.givenProvider;
      return new Web3(provider);
    } catch (err) {
      throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
    }
  }
});
