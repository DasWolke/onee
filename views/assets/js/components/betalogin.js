/**
 * Created by julian on 10.03.2016.
 */
/**
 * Created by julian on 10.03.2016.
 */
var React = require("React");
var Client = React.createClass({
    render: function () {
        return (
            <div>
                <h1>login</h1>
                <form action="/sessions/create" method="post">
                    <input type="text" name="username" placeholder="username..."/>
                    <input type="password" name="password" placeholder="Password..."/>
                    <input type="submit" name="submit" placeholder="Submit"/>
                </form>
            </div>);
    }
});
module.exports = Client;