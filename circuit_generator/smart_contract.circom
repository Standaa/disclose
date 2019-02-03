include "pedersen_old_indexes.circom";
include "bitify.circom";

template Main(n, k) {
    signal private input priv[k];
    signal input in[n];
    signal private input sig[2];

    signal output out[2];

    component pedersen = Pedersen(250*(n+k));
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
    component n2b[k];
    for  (i=0; i<k; i++) {
        n2b[i] = Num2Bits(250);
        priv[i] ==> n2b[i].in;
    }

    for (j = 0; j<k; j++){
        for  (i=0; i<250; i++) {
            n2b[j].out[i] ==> pedersen.in[(n+j)*250+i];
        }
    }

    pedersen.out[0] ==> out[0];
    pedersen.out[1] ==> out[1];
}

component main = Main(2, 3);