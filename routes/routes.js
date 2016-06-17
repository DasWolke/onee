var express = require('express');
var shortid = require('shortid');
var fs = require('fs');
var brypt = require("bcrypt-nodejs");
var multer = require('multer');
var ImageModel = require('../DB/image.mongo.js');
var lodash = require('lodash');
var User = require("../DB/user.mongo.js");
var config = require("../config");
var jwt = require('jsonwebtoken');
var path = require('path');
var imageHelper = require('../helper/image-helper');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '.' + getExt(file.originalname))
    }
});
var upload = multer({storage: storage});
var app = express.Router();
module.exports = app;
app.post('/i/up', upload.single('file'), function (req, res, next) {
    req.connection.on('close', function (err) {
        return;
    });
    var imgPath = req.file.path.replace('upload\\', ''),
        imgLinx = imgPath.replace('upload/', ''), id = imgLinx.replace(/(.*)\.(.*?)$/, "$1"),
        image = new ImageModel({
            id: id,
            name: req.file.originalname,
            type: req.file.mimetype,
            path: imgLinx,
            date: Date.now(),
            originPath: req.file.path,
            posted: false,
            checkedWith: [],
            dupes: []
        });
    if (image.type === 'image/jpeg') {
        image.save();
        res.status(200).send(id);
        imageHelper.prepImage(true, image);
    } else if (image.type === 'image/png') {
        image.save();
        res.status(200).send(id);
        imageHelper.prepImage(true, image);
    } else if (image.type === 'image/gif') {
        image.save();
        res.status(200).send(id);
        imageHelper.prepImage(true, image);
    } else {
        res.status(400).send('This Filetype is not allowed!');
        fs.unlink(req.file.path, function (err) {
            if (err) {
                return err;
            }
        });
    }
});
app.get('/i/:id', function (req, res) {
    ImageModel.findOne({id: req.params.id}, function (err, image) {
        if (err) {
            return err;
        }
        var options = {
            root: path.join(__dirname, '../upload')
        };
        if (image) {
            res.sendFile(image.path, options, function (err) {
                if (err) res.send(err);
            });
        } else {
            ImageModel.findOne({path: req.params.id}, function (err, image) {
                if (err) return err;
                if (image) {
                    res.sendFile(image.path, options, function (err) {
                        if (err) return res.send(err);
                    });
                } else {
                    res.render('img', {img: '/assets/404/404.png'});
                }
            });
        }
    });
});
function createToken(user) {
    return jwt.sign(lodash.omit(user), config.secret, {expiresIn: 60 * 60 * 5});
}
function getExt(fname) {
    return fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);
}
function getUserScheme(req) {

    var username;
    var type;
    var userSearch = {};

    if (req.body.username) {
        username = req.body.username;
        type = 'username';
        userSearch = {username: username};
    }
    else if (req.body.email) {
        username = req.body.email;
        type = 'email';
        userSearch = {email: username};
    }

    return {
        username: username,
        type: type,
        userSearch: userSearch
    }
}
app.post('/users', function (req, res) {

    var userScheme = getUserScheme(req);

    if (!userScheme.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }

    User.findOne({username: userScheme.username}, function (err, user) {
        if (user) {
            return res.status(400).send("User exists already!");
        } else {
            var hash = brypt.hashSync(req.body.password);
            var userReg = new User({
                username: userScheme.username,
                hash: hash,
                avatar: null,
                role: 0
            });
            userReg.save();
            res.redirect('/register');
        }
    });
});

app.post('/sessions/create', function (req, res) {

    var userScheme = getUserScheme(req);

    if (!userScheme.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }
    User.findOne({username: userScheme.username}, function (err, user) {
        if (err) return console.log(err);
        if (!user) {
            return res.status(401).send({message: "The username or password don't match", user: user});
        }
        if (brypt.compareSync(req.body.password, user.hash)) {
            res.status(201).send({
                id_token: createToken(user)
            });
        } else {
            return res.status(401).send({message: "Wrong User or Password."});
        }
    });
});
app.all("*", function (req, res) {
    var options = {
        root: path.join(__dirname, '../views')
    };
    res.sendFile('index.html', options, function (err) {
        if (err) return console.log(err);
    });
});
