/**
 * Created by julian on 16.03.2016.
 */
var imageModel = require('../DB/image.mongo.js');
var express = require('express');
var app = module.exports = express.Router();
app.get('/api/maxpage', function (req, res) {
    imageModel.count({}, function (err, count) {
        if (err) return res.send('A Error has occured!');
        var pages = count / 30;
        var jsonPages = [];
        var maxPageNum = Math.ceil(pages);
        for (i = 0; i < pages; i++) {
            jsonPages.push({page:i+1});
        }
        res.send(jsonPages);
    });
});
app.get('/api/images/dup', function (req,res) {
    imageModel.find({'dupes.0':{$exists:true}}, {checkedWith:0, channelPosted:0, name:0,posted:0}, function (err, Images) {
        if (err) return res.send({error:-1, message:'A Internal Error has occured, check back later.'});
        res.send(Images);
    });
});
app.get('/api/images/:id', function (req, res) {
    imageModel.find({},{checkedWith:0, channelPosted:0, hash:0, name:0,posted:0, dupes:0}).limit(30).skip((parseInt(req.params.id) -1) * 30).sort('-date').find({}, function (err, Images) {
        if (err) {
            console.log(err);
            return res.send({error:-1, message:'A Internal Error has occured, check back later.'});
        }
        if (Images.length == 0) {
            res.send({message:'No Result'});
        } else {
            res.send(Images);
        }
    });
});