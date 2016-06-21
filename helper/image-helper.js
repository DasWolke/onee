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
    helper.logInfo('started Prepimage');
    createThumb(single, image, function (err, image) {
        if (err) {
            helper.logInfo('Error at create Thumb!');
            return helper.logInfo(err);
        }
        helper.logInfo('Finished Thumb for Image ' + image.id);
        genHash(single, image, function (err) {
            if (err) {
                helper.logInfo('Error at create Hash');
                return helper.logInfo(err);
            }
            checkHash(single, image, function (err) {
                if (err) {
                    helper.logInfo('Error at Check Hash');
                    return helper.logInfo(err);
                }
                helper.logInfo('Image ' + image.id + ' finished!');
            });
        });
    });
};
var createThumb = function (single, resImage, cb) {
    if (single === true) {
        if (!resImage) {
            return helper.logInfo("No Image Provided");
        } else {
            imageModel.findOne({id: resImage.id}, function (err, image) {
                if (err) return cb(err);
                if (!image) {
                    cb('NO Image found!', null);
                } else {
                    resizeImage(image, function (err, image_org, curFile) {
                        if (err) return cb(err);
                        imageModel.update({id: resImage.id}, {
                            $set: {
                                width: curFile.width,
                                height: curFile.height,
                                thumbnail: "thumbnail/" + resImage.path
                            }
                        }, function (err) {
                            if (err) return cb(err);
                            cb(null, resImage);
                        });
                        helper.logInfo("Finished Resizing: " + image_org.id);
                    });
                }
            });
        }
    } else {
        imageModel.find({
            $or: [{thumbnail: {$exists: false}}, {thumbnail: ''}]
        }, function (err, images) {
            var q = async.queue(function (Image, callback) {
                if (err) return callback(err);
                var id = Image.id;
                resizeImage(Image, function (err, image_org, image_info) {
                    if (err) return callback(err);
                    helper.logInfo("updated " + image_org.path);
                    imageModel.update({_id: image_org._id}, {
                        $set: {
                            width: image_info.width,
                            height: image_info.height,
                            thumbnail: "thumbnail/" + image_org.path
                        }
                    }, function (err) {
                        if (err) return callback(err);
                        helper.logInfo('finished Image ' + image_org.id);
                        callback();
                    });
                });
            }, 2);
            q.push(images, function (err) {
                if (err) return helper.logInfo(err);
                helper.logInfo("Finished Resizing all Images");
            });
        });
    }
};
var resizeImage = function (image, cb) {
    gm("upload/" + image.path).size(function (err, curFile) {
        if (err) return cb(err, null, null);
        helper.logInfo("Got Info for " + image.id);
        var width = curFile.width;
        var height = curFile.height;
        var newHeight = 200;
        gm("upload/" + image.path).resize(null, newHeight).write("upload/thumbnail/" + image.path, function (err) {
            if (err) return cb(err, null, null);
            cb(null, image, curFile);
        });
    });
};
var genHash = function (useID, image, call) {
    if (useID) {
        imageModel.findOne({
            id: image.id,
            hash: {$exists: false},
            $or: [{type: 'image/png'}, {type: 'image/jpg'}, {type: 'image/jpeg'}]
        }, function (err, image) {
            if (err) return call(err);
            if (!image) {
                return call('No image found');
            }
            if (image.type != 'image/png') {
                if (image.type != 'image/gif') {
                    convertToPng("upload/" + image.path, image, function (err) {
                        if (err) return call(err);
                        imageModel.findOne({
                            id: image.id,
                            hash: {$exists: false},
                            $or: [{type: 'image/png'}, {type: 'image/jpg'}, {type: 'image/jpeg'}]
                        }, function (err, image) {
                            var path = "upload/" + image.path;
                            dhash(path, function (err, hash) {
                                if (err) {
                                    fs.stat("upload/" + image.id + ".jpg", function (err, stat) {
                                        if (err == null && err.code != 'ENOENT') {
                                            convertToPng("upload/" + image.id + ".jpg", image, function (err) {
                                                helper.logInfo('Converted File ' + image.id);
                                                if (err) return call(err);
                                                call();
                                            });
                                        } else {
                                            fs.stat("upload/" + image.id + ".jpeg", function (err, stat) {
                                                if (err == null && err.code != 'ENOENT') {
                                                    convertToPng("upload/" + image.id + ".jpg", image, function (err) {
                                                        helper.logInfo('Converted File ' + image.id);
                                                        if (err) return call(err);
                                                        call();
                                                    });
                                                } else {
                                                    call(err);
                                                }
                                            });
                                        }
                                    });
                                    return call(err);
                                }
                                imageModel.update({id: image.id}, {$set: {hash: hash}}, function (err) {
                                    if (err) {
                                        return call(err);
                                    }
                                    helper.logInfo("Updated Image " + image.path);
                                    call();
                                });
                            });
                        });
                    });
                }
            } else {
                var path = "upload/" + image.path;
                dhash(path, function (err, hash) {
                    if (err) {
                        fs.stat("upload/" + image.id + ".jpg", function (err, stat) {
                            if (err == null && err.code != 'ENOENT') {
                                convertToPng("upload/" + image.id + ".jpg", image, function (err) {
                                    helper.logInfo('Converted File ' + image.id);
                                    if (err) return call(err);
                                    call();
                                });
                            } else {
                                fs.stat("upload/" + image.id + ".jpeg", function (err, stat) {
                                    if (err == null && err.code != 'ENOENT') {
                                        convertToPng("upload/" + image.id + ".jpg", image, function (err) {
                                            helper.logInfo('Converted File ' + image.id);
                                            if (err) return call(err);
                                            call();
                                        });
                                    } else {
                                        call(err);
                                    }
                                });
                            }
                        });
                        return call(err);
                    }
                    imageModel.update({id: image.id}, {$set: {hash: hash}}, function (err) {
                        if (err) {
                            return call(err);
                        }
                        helper.logInfo("Updated Image " + image.path);
                        call();
                    });
                });
            }
        });
    } else {
        imageModel.findOne({
            hash: {$exists: false},
            $or: [{type: 'image/png'}, {type: 'image/jpg'}, {type: 'image/jpeg'}]
        }, function (err, image) {
            if (err) return call(err);
            if (!image) {
                return call('No image found!');
            }
            if (image.type != 'image/png') {
                if (image.type != 'image/gif') {
                    gm("upload/" + image.path).write("upload/" + image.id + ".png", function (err, test) {
                        if (err) return call(err);
                        imageModel.update({id: image.id}, {
                            $set: {
                                type: 'image/png',
                                path: image.id + '.png'
                            }
                        }, function (err) {
                            if (err) return call(err);
                            fs.unlink("upload/" + image.path, function (err) {
                                if (err) return call(err);
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
                                    if (err) return call(err);
                                    call();
                                });
                            } else {
                                helper.logInfo(err);
                                fs.stat("upload/" + image.id + ".jpeg", function (err, stat) {
                                    if (err == null) {
                                        convertToPng("upload/" + image.id + ".jpg", image, function (err) {
                                            helper.logInfo('Converted File ' + image.id);
                                            if (err) return call(err);
                                            call();
                                        });
                                    } else {
                                        call(err);
                                    }
                                });
                            }
                        });
                        return helper.logInfo(err);
                    }
                    imageModel.update({id: image.id}, {$set: {hash: hash}}, function (err) {
                        if (err) {
                            return call(err);
                        }
                        helper.logInfo("Updated Image " + image.path);
                        call();

                    });
                });
            }
        });
    }
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
            if (err) return cb(err);
            fs.unlink(path, function (err) {
                if (err) return cb(err);
                cb();
            });
        });
    });
};
var checkHash = function (single, image, cb) {
    if (single) {
        var imageTemp = [];
        var dupesTemp = [];
        var bulk = imageModel.collection.initializeUnorderedBulkOp();
        var useBulk = true;
        imageModel.findOne({id: image.id}, function (err, Image) {
            if (err) return cb(err);
            if (!Image) return cb('No Image Found!');
            imageModel.find({id: {$ne: image.id}, hash: {$exists: true}}, function (err, Images) {
                async.each(Images, function (otherImg, call) {
                    if (Image.id !== otherImg.id) {
                        if (contains.call(Image.checkedWith, otherImg.id)) {
                            if (contains.call(otherImg.checkedWith, Image.id)) {
                                useBulk = false;
                            } else {
                                bulk.find({_id: otherImg._id}).update({$addToSet: {checkedWith: Image.id}});
                            }
                        } else {
                            try {
                                var hash = hamming(Image.hash, otherImg.hash);
                            } catch (err) {
                                helper.logInfo(Image);
                                helper.logInfo(Image.hash);
                                helper.logInfo(otherImg.hash);
                                return call(err);
                            }
                            if (hash < 5) {
                                dupesTemp.push(Image.id);
                                bulk.find({_id: otherImg._id}).update({$addToSet: {dupes: Image.id}});
                            }
                            bulk.find({_id: otherImg._id}).update({$addToSet: {checkedWith: Image.id}});
                            imageTemp.push(otherImg.id);
                        }
                    }
                    async.setImmediate(function () {
                        call();
                    });
                }, function (err) {
                    if (err) return cb(err);
                    if (useBulk) {
                        bulk.execute(function (err) {
                            if (err) return cb(err);
                            imageModel.update({_id: Image._id}, {
                                $addToSet: {
                                    checkedWith: {$each: imageTemp},
                                    dupes: {$each: dupesTemp}
                                }
                            }, function (err, res) {
                                if (err) return cb(err);
                                cb();
                            });
                        });
                    } else {
                        async.setImmediate(function () {
                            callback();
                        });
                    }
                });
            });
        });
    } else {
        imageModel.find({hash: {$exists: true}}, function (err, Images) {
            if (err) return cb(err);
            var q = async.queue(function (Image, callback) {
                var imageTemp = [];
                var dupesTemp = [];
                var bulk = imageModel.collection.initializeUnorderedBulkOp();
                var useBulk = true;
                async.each(Images, function (otherImg, cb) {
                    if (Image.id != otherImg.id) {
                        if (contains.call(Image.checkedWith, otherImg.id)) {
                            if (contains.call(otherImg.checkedWith, Image.id)) {
                                useBulk = false;
                            } else {
                                bulk.find({_id: otherImg._id}).update({$addToSet: {checkedWith: Image.id}});
                            }
                        } else {
                            var hash = hamming(Image.hash, otherImg.hash);
                            if (hash < 5) {
                                dupesTemp.push(Image.id);
                                bulk.find({_id: otherImg._id}).update({$addToSet: {dupes: Image.id}});
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
            }, 1);
            q.push(Images, function (err) {
                if (err) return helper.logInfo(err);
                cb('Checked Image');
            });
        });
    }
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
module.exports = {
    resizeImage: resizeImage,
    createThumb: createThumb,
    genHash: genHash,
    checkHash: checkHash,
    prepImage: prepImage
};