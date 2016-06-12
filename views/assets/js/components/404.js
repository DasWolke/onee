/**
 * Created by julian on 10.03.2016.
 */
var React = require("react");
var Four = React.createClass({
    render: function () {
        return (<div className="row">
            <div className="col-lg-6 col-xs-12 col-lg-offset-3">
                <h2>You have no Permissions to view this Page!</h2>
                <img className="img-responsive register" src="../../assets/images/render_749.png"/>
            </div>
        </div>);
    }
});
module.exports = Four;