/**
 * Created by julian on 07.03.2016.
 */
var React = require("react");
var ReactDOM = require("react-dom");
var Four = require("./404.js");
var Image = require('./image');
var Client = React.createClass({
    loadImages: function () {
        $.ajax({
            url: this.state.url + "images/dup",
            dataType: 'json',
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('#GET Error', status, err.toString());
            }.bind(this)
        });
    },
    prepList: function () {
        var nodes;
        return nodes = this.state.data.map(function (image) {
            var imageDupes = image.dupes.map(function (dup) {
                return (
                    <Image key={dup} url={dup} thumbnail={"/"}/>
                )
            });
            return (
                <div className="panel panel-default">
                    <div className="panel-body">
                        <Image key={image.id} url={image.id} thumbnail={"/" + image.thumbnail}/>
                        <div><h1>Duplikate des Bildes</h1>
                            {imageDupes}
                        </div>
                    </div>
                </div>
            )
        });
    },
    getInitialState: function () {
        return {data: [], url: "/api/"}
    },
    componentDidMount: function () {
        this.loadImages();
    },
    render: function () {
        const {isAuthenticated} = this.props;
        var nodes = this.prepList();
        return (
            <div>
                {isAuthenticated &&
                <div className="client">
                    <h1>Duplikate</h1>
                    {nodes}
                </div>
                }
                {!isAuthenticated &&
                <Four />}</div>

        );
    }
});
module.exports = Client;