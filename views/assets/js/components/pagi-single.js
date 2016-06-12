/**
 * Created by julian on 05.03.2016.
 */
var React = require("react");
var ReactDOM = require("react-dom");
import {Link} from 'react-router'
var LI = React.createClass({
    render: function() {
        return(
            <li><Link key={this.props.num} to={"/p/" + this.props.num} onClick={this.props.cb.bind(null, this.props.num)}>{this.props.num}</Link></li>
        )
    }
});
module.exports = LI;