include "pedersen_old.circom";
include "bitify.circom";

template Main(n) {
    signal private input priv;
    signal input in[n];

    signal output out[2];

    component pedersen = Pedersen(250*(n+1));
    var i;
    var j;

    component n2a[n];
    for  (i=0; i<n; i++) {
        n2a[i] = Num2Bits(250);
        in[i] ==> n2a[i].in;
    }
    for (j = 0; j<n; j++){
    	for  (i=0; i<250; i++) {
            n2a[j].out[i] ==> pedersen.in[j*250+i];
        }
    }
    component n2b;
    n2b = Num2Bits(250);
    priv ==> n2b.in;

	for  (i=0; i<250; i++) {
        n2b.out[i] ==> pedersen.in[n*250+i];
    }

    pedersen.out[0] ==> out[0];
    pedersen.out[1] ==> out[1];
}

component main = Main(6);