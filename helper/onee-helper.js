/**
 * Created by julian on 06.03.2016.
 */
var logInfo = function (Message) {
    var d = new Date();
    console.log("[" + d.getDate() +"."+ d.getMonth()+"."+ d.getFullYear() +" "+ d.getHours() +":"+  d.getMinutes()+":"+ d.getSeconds() + "] [INFO] " + Message);
};
module.exports = {logInfo};