import {Injectable} from '@angular/core';

import { WindowRefService, ICustomWindow } from './../services/window.ref.service';

import * as zkSnark from "snarkjs";

@Injectable()
export class AppHelperService {

  window: ICustomWindow;

  constructor(
    private windowRef: WindowRefService
  ) {
    this.window = this.windowRef.nativeWindow;
  }

  random (num_bytes) {
    const random_array = window.crypto.getRandomValues(new Uint32Array(num_bytes));
    let big_random = "";
    for(var i = 0; i < num_bytes; i++) {
      let small_random = zkSnark.bigInt(random_array[i]).toString(10);
      big_random += small_random;
    }
    return zkSnark.bigInt(big_random);
  }

  str2Hex(str) {
    let result = "";
    for (var i=0; i<str.length; i++) {
        let hex = str.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result;
  }

}
