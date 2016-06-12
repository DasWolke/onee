var React = require("react");
var ReactDOM = require("react-dom");
var Image = require('./image.js');
var Images = React.createClass({
    prepImageNodes: function () {
        var nodes;
        return nodes = this.props.data.map(function (image) {
            return (
                <Image key={image.id} url={image.id} thumbnail={"/" + image.thumbnail}/>
            )
        });
    },
    render: function () {
        var imageNodes = this.prepImageNodes();
        return (
                <div className="col-md-10 col-xs-12 col-lg-10 col-md-offset-1 col-lg-offset-1">
                    {imageNodes}
                </div>
        );

    }
});
module.exports = Images;
