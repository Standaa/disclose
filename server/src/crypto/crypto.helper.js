const self = module.exports = {

  str2Hex(str) {
    let result = "";
    for (var i=0; i<str.length; i++) {
        let hex = str.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result;
  },

  // Adds two arrays for the given base (10 or 16), returning the result.
  // This turns out to be the only "primitive" operation we need.
  add(x, y, base) {
    var z = [];
    var n = Math.max(x.length, y.length);
    var carry = 0;
    var i = 0;
    while (i < n || carry) {
      var xi = i < x.length ? x[i] : 0;
      var yi = i < y.length ? y[i] : 0;
      var zi = carry + xi + yi;
      z.push(zi % base);
      carry = Math.floor(zi / base);
      i++;
    }
    return z;
  },
  // Returns a*x, where x is an array of decimal digits and a is an ordinary
  // JavaScript number. base is the number base of the array x.
  multiplyByNumber(num, x, base) {
    if (num < 0) return null;
    if (num == 0) return [];

    var result = [];
    var power = x;
    while (true) {
      if (num & 1) {
        result = self.add(result, power, base);
      }
      num = num >> 1;
      if (num === 0) break;
      power = self.add(power, power, base);
    }

    return result;
  },

  parseToDigitsArray(str, base) {
    var digits = str.split('');
    var ary = [];
    for (var i = digits.length - 1; i >= 0; i--) {
      var n = parseInt(digits[i], base);
      if (isNaN(n)) return null;
      ary.push(n);
    }
    return ary;
  },

  convertBase(str, fromBase, toBase) {
    var digits = self.parseToDigitsArray(str, fromBase);
    if (digits === null) return null;

    var outArray = [];
    var power = [1];
    for (var i = 0; i < digits.length; i++) {
      // invariant: at this point, fromBase^i = power
      if (digits[i]) {
        outArray = self.add(outArray, self.multiplyByNumber(digits[i], power, toBase), toBase);
      }
      power = self.multiplyByNumber(fromBase, power, toBase);
    }

    var out = '';
    for (var i = outArray.length - 1; i >= 0; i--) {
      out += outArray[i].toString(toBase);
    }
    return out;
  },

  decToHex(decStr) {
    var hex = self.convertBase(decStr, 10, 16);
    return hex ? hex : null;
  },

  hexToDec(hexStr) {
    if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
    hexStr = hexStr.toLowerCase();
    return convertBase(hexStr, 16, 10);
  },

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }


}
