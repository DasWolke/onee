/**
 * Created by julian on 10.03.2016.
 */
var imageModel = require('../DB/image.mongo.js');
var helper = require('./onee-helper.js');
var dhash = require('dhash');
var gm = require('gm');
var fs = require('fs');
var async = require('async');
var hamming = require('compute-hamming');
var prepImage = function (single, image, cb) {
    createThumb(single, image, function () {

    });
};
var createThumb = function (single, resImage, cb) {
    if (single === true) {
        if (!resImage) {
            return helper.logInfo("No Image Provided");
        } else {
            imageModel.findOne({id: resImage}, function (err, image) {
                if (err) return helper.logInfo(err);
                if (!image) {

                } else {
                    resizeImage(image, function (image_org) {
                        imageModel.update({id: resImage}, {
                            $set: {
                                width: image_org.width,
                                height: image_org.height,
                                thumbnail: "thumbnail/" + resImage.name
                            }
                        }, {multi: true}, function (err) {
                            if (err) return helper.logInfo(err);
                            cb();
                        });
                        helper.logInfo("Finished Resizing: " + image_org.name);
                    });
                }
            });
        }
    } else {
        imageModel.find({$or: [{thumbnail: {$exists:false}}, {thumbnail: ''}]
        }, function (err, images) {
            if (err) return helper.logInfo(err);
            for (var i = 0; i < images.length; i++) {
                var id = images[i].id;
                resizeImage(images[i], function (image_org, image_info) {
                    helper.logInfo("updated " + image_org.path);
                    imageModel.update({_id: image_org._id}, {
                        $set: {
                            width: image_info.width,
                            height: image_info.height,
                            thumbnail: "thumbnail/" + image_org.path
                        }
                    }, {multi: true}, function (err) {
                        if (err) return helper.logInfo(err);
                        helper.logInfo('finished Image ' + image_org.name);
                    });
                });
                i++;
            }
            helper.logInfo("Finished On Start Resizing");
        });
    }
};
var resizeImage = function (image, cb) {
    gm("upload/" + image.path).size(function (err, curFile) {
        if (err) return console.log(err);
        helper.logInfo("Got Info for " + image.id);
        var width = curFile.width;
        var height = curFile.height;
        var newHeight = 200;
        var newWidth = Math.ceil((curFile.width / curFile.height) * newHeight);
        copyFile("upload/" + image.path, "upload/thumbnail/" + image.path, function (err) {
            if (err) return console.log(err);
            gm("upload/" + image.path).resample(newWidth, newHeight);
            cb(image, curFile);
        });
    });
};
var genHash = function (call) {
    imageModel.findOne({
        hash: {$exists: false},
        $or: [{type: 'image/png'}, {type: 'image/jpg'}, {type: 'image/jpeg'}]
    }, function (err, image) {
        if (err) return helper.logInfo(err);
        if (!image) {
            return;
        }
        if (image.type != 'image/png') {
            if (image.type != 'image/gif') {
                gm("upload/" + image.path).write("upload/" + image.id + ".png", function (err, test) {
                    if (err) return console.log(err);
                    imageModel.update({id: image.id}, {
                        $set: {
                            type: 'image/png',
                            path: image.id + '.png'
                        }
                    }, function (err) {
                        if (err) return console.log(err);
                        fs.unlink("upload/" + image.path, function (err) {
                            if (err) return console.log(err);
                            call();
                        });
                    });
                });
            }
        } else {
            var path = "upload/" + image.path;
            dhash(path, function (err, hash) {
                if (err) {
                    fs.stat("upload/" + image.id + ".jpg", function (err, stat) {
                        if (err == null) {
                            convertToPng("upload/" + image.id + ".jpg", image, function (err) {
                                helper.logInfo('Converted File ' + image.id);
                                if (err) return console.log(err);
                                call();
                            });
                        } else {
                            console.log(err);
                            fs.stat("upload/" + image.id + ".jpeg", function (err, stat) {
                                if (err == null) {
                                    convertToPng("upload/" + image.id + ".jpg", image, function (err) {
                                        helper.logInfo('Converted File ' + image.id);
                                        if (err) return console.log(err);
                                        call();
                                    });
                                } else {
                                    console.log(err);
                                }
                            });
                        }
                    });
                    return helper.logInfo(err);
                }
                imageModel.update({id: image.id}, {$set: {hash: hash}}, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    call();
                    helper.logInfo("Updated Image " + image.path);
                });
            });
        }
    });
};
var convertToPng = function (path, image, cb) {
    gm(path).write("upload/" + image.id + ".png", function (err, test) {
        if (err) return cb(err);
        imageModel.update({id: image.id}, {
            $set: {
                type: 'image/png',
                path: image.id + '.png'
            }
        }, function (err) {
            if (err) return console.log(err);
            fs.unlink(path, function (err) {
                if (err) return cb(err);
            });
        });
    });
};
var checkHash = function (cb) {
    imageModel.find({hash: {$exists: true}}, function (err, Images) {
        if (err) return helper.logInfo(err);
        var q = async.queue(function (Image, callback) {
            var imageTemp = [];
            var dupesTemp = [];
            var bulk = imageModel.collection.initializeUnorderedBulkOp();
            var useBulk = true;
            async.each(Images, function (otherImg, cb) {
                if (Image.id != otherImg.id) {
                    if (contains.call(Image.checkedWith, otherImg.id)) {
                        //console.log('Image ' + Image.id + ' already checked with ' + Images[x].id);
                        if (contains.call(otherImg.checkedWith, Image.id)) {
                            useBulk = false;
                        } else {
                            bulk.find({_id: otherImg._id}).update({$addToSet: {checkedWith: Image.id}});
                        }
                    } else {
                        var hash = hamming(Image.hash, otherImg.hash);
                        if (hash < 5) {
                            // console.log("Image " + Image.id + " and Image " + otherImg.id + " seem to be not very different.");
                            // console.log(hash);
                            dupesTemp.push(Image.id);
                            imageModel.update({_id: otherImg._id}, {$addToSet: {dupes: Image.id}}, function (err) {
                                if (err) return cb(err);
                            });
                        }
                        bulk.find({_id: otherImg._id}).update({$addToSet: {checkedWith: Image.id}});
                        imageTemp.push(otherImg.id);
                    }
                }
                async.setImmediate(function () {
                    cb();
                });
            }, function (err) {
                if (err) return callback(err);
                if (useBulk) {
                    bulk.execute(function (err) {
                        // console.log('Finished Async Bulk!');
                        if (err) return callback(err);
                        imageModel.update({_id: Image._id}, {
                            $addToSet: {
                                checkedWith: {$each: imageTemp},
                                dupes: {$each: dupesTemp}
                            }
                        }, function (err, res) {
                            if (err) return callback(err);
                            callback();
                        });
                    });
                } else {
                    async.setImmediate(function () {
                        callback();
                    });
                }
            });
        }, 50);
        q.push(Images, function (err) {
            if (err) return helper.logInfo(err);
            cb('success');
        });
    });
};
var contains = function (needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            var i = -1, index = -1;

            for (i = 0; i < this.length; i++) {
                var item = this[i];

                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};
var copyFile = function (source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
};
module.exports = {resizeImage: resizeImage, createThumb: createThumb, genHash: genHash, checkHash: checkHash};