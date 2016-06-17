/**
 * Created by julian on 23.02.2016.
 */
console.log('Beginning INIT....');
var dd_options = {
    'response_code': true,
    'tags': ['Onee:Main Server']
};
var express = require('express');
var connect_datadog = require('connect-datadog')(dd_options);
var rollbar = require("rollbar");
rollbar.init("3d3399ae1e7a48ab946ee9dcacd4148c");
var logger = require("morgan");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/onee', function (err) {
    if (err) {
        helper.logInfo('DB Connection Error!');
        return rollbar.reportMessage(err);
    }
});
var helper = require('./helper/onee-helper.js');
var imageHelper = require("./helper/image-helper.js");
var imageModel = require('./DB/image.mongo');
//var settings = require('./DB/settings.mongo.js');
app.listen(7002, '127.0.0.1');
app.use(connect_datadog);
app.use(express.static('views/'));
app.use(express.static('upload/'));
app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(require("./routes/api.js"));
app.use(require("./routes/routes.js"));
console.log('Finished INIT...');
imageHelper.createThumb(false);
helper.logInfo('Der Server ist gestartet!');
imageHelper.checkHash(function (result) {
    helper.logInfo(result);
});
