include "escalarmul.circom";

template verifySig() {
    signal private input s;
    signal private input r;
    signal input g[2];
    signal y;

    component scalarMul;

    scalarMul = EscalarMul(250, g)
    var j;
    for (j=0; j<nexpbits; j++) {
        scalarMul.in[j] <== in[j];
    }

            if (i==0) {
            escalarMuls.inp[0] <== 0;
            escalarMuls[i].inp[1] <== 1;
        } else {
            escalarMuls[i].inp[0] <== escalarMuls[i-1].out[0];
            escalarMuls[i].inp[1] <== escalarMuls[i-1].out[1];
        }