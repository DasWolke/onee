/**
 * Created by julian on 05.03.2016.
 */
var React = require("react");
var ReactDOM = require("react-dom");
var Header = React.createClass({
        render: function() {
            return (<div className="header">
                <h1 className="lato">Welcome to Onee.moe!</h1>
                <h3 className="lato">Latest Uploads:</h3>
            </div>)
        }
    });
module.exports = Header;
