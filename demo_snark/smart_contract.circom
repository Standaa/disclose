include "pedersen_old_indexes.circom";
include "bitify.circom";
include "eddsa.circom";

template Main(n, k) {
    signal input in[n];
    signal input A[256];

    signal private input secret[k];
    signal private input priv;
    signal private input R8[256];
    signal private input S[256];
    signal private input msg[256];

    component pedersen = Pedersen(250*(n+k+1));
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
        secret[i] ==> n2b[i].in;
    }
    for (j = 0; j<k; j++){
        for  (i=0; i<250; i++) {
            n2b[j].out[i] ==> pedersen.in[(n+j)*250+i];
        }
    }

    component n2c;
    n2c = Num2Bits(250);
    priv ==> n2c.in;
    for  (i=0; i<250; i++) {
        n2c.out[i] ==> pedersen.in[(n+k)*250+i];
    }

    component eddsa = EdDSAVerifier(256);

    for  (i=0; i<256; i++) {
        msg[i] ==> eddsa.msg[i];
    }

    for  (i=0; i<256; i++) {
        A[i] ==> eddsa.A[i];
        R8[i] ==> eddsa.R8[i];
        S[i] ==> eddsa.S[i];    
    }

}

component main = Main(4, 2);