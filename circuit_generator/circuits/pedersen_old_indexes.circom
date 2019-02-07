
include "escalarmul.circom";

template Pedersen(n) {
    signal input in[n];
    signal output out[2];

    var nexps = ((n-1) \ 250) + 1;
    var nlastbits = n - (nexps-1)*250;

    component escalarMuls[nexps];

    var PBASE = [[16540640123574156134436876038791482806971768689494387082833631921987005038935,
  20819045374670962167435360035096875258406992893633759881276124905556507972311],
 [16113908992958654580576121332105641939386785007070631827837038721187369061406,
  13543135889321786196419170914180430694274295243334629701622351182531864521005],
 [1076620697199135180779993208327990452191184083362380553163440209762849514722,
  9853647717691139336869472377314617825232074251805086035693773616712748042621],
 [16627001262217752418232399229085639463508031460877751193558076525766939746290,
  11293652998871813128673002603563161847178345330386607075500167792306707414784],
 [17193433650870834145767552013187426225541809928144693031023390964075029712734,
  5072569689932329450279131871579186295141413025474978915530995363951190322881],
 [4873235912926533530309568745817380743686540272116562512062487934223913563495,
  20887932140417543826962958973692455850672178541440622622454994848671306619256]];
        
    var i;
    var j;
    var nexpbits;
    for (i=0; i<nexps; i++) {
        nexpbits = (i == nexps-1) ? nlastbits : 250;
        escalarMuls[i] = EscalarMul(nexpbits, PBASE[i]);

        for (j=0; j<nexpbits; j++) {
            escalarMuls[i].in[j] <== in[250*i + j];
        }

        if (i==0) {
            escalarMuls[i].inp[0] <== 0;
            escalarMuls[i].inp[1] <== 1;
        } else {
            escalarMuls[i].inp[0] <== escalarMuls[i-1].out[0];
            escalarMuls[i].inp[1] <== escalarMuls[i-1].out[1];
        }
    }

    escalarMuls[nexps-1].out[0] ==> out[0];
    escalarMuls[nexps-1].out[1] ==> out[1];
}