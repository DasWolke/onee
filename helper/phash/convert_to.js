/**
 * Created by julian on 14.03.2016.
 */
var reRaw = /PH[1-7].*/g;
var reRoar = /PH[1-7]:./g;
var reNya = /[0-9][.0-9]*/g;
var gm = require('gm');
var getHash = function(file, cb) {
    // gm(file).identify(function (err,res) {
    //     if (err) return console.log(err);
    //     console.log(res);
    //     var m;
    //     var phRaw = [];
    //     var phRoar = [];
    //     var phNya = [];
    //     while (m = reRaw.exec(res)) {
    //         phRaw.push(m[0]);
    //     }
    //     for (var i = 0; i < phRaw.length; i++) {
    //         var phRawRes = phRaw[i].replace(reRoar, '');
    //         phRoar.push(phRawRes)
    //     }
    //     while (m = reNya.exec(phRoar)) {
    //         phNya.push(m[0]);
    //     }
    //     if (phNya.length !== 42) {
    //         console.log(phNya);
    //         return console.log("Error: Array has " + phNya.length + " Values.");
    //     } else {
    //         var hash = "";
    //         for (var nya = 0; nya < phNya.length; nya++) {
    //             var val = phNya[nya];
    //             var neko;
    //             var daiNeko;
    //             if (val < 0) {
    //                 neko = 100 * (Number(val) - 0.005);
    //             } else {
    //                 neko = 100 * (Number(val) + 0.005);
    //             }
    //             daiNeko = parseInt(neko);
    //             var pudiNeko = padToFour(daiNeko);
    //             hash = hash + pudiNeko.toString();
    //         }
    //     }
    //     cb(null, hash);
    // });
    // var image  = new Chohuku(file);
    // image.getPHash.then((hash => console.log(hash)));
};
function padToFour(number) {
    if (number<=9999) { number = ("000"+number).slice(-4); }
    return number;
}
module.exports = getHash;