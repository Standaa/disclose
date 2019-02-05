const self = module.exports = {

  str2Hex(str) {
    let result = "";
    for (var i=0; i<str.length; i++) {
        let hex = str.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result;
  }

}
