/**
 * Created by julian on 28.01.2016.
 */
var mongoose = require('mongoose');
var imageSchema = mongoose.Schema({
    id: String,
    type: String,
    path: String,
    name: String,
    date: Date,
    posted: Boolean,
    thumbnail: String,
    height: Number,
    width: Number,
    hash: String,
    checkedWith:[],
    dupes:[]
});
var imageModel = mongoose.model('Image', imageSchema);
module.exports = imageModel;