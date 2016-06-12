/**
 * Created by julian on 10.03.2016.
 */
    //currently not with live reload!
var React = require("React");
var Client = React.createClass({
    render: function () {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-xs-6 col-lg-offset-3 col-xs-offset-3">
                        <h1 className="lato">Register</h1>
                        <p>Register now <span className="glyphicon glyphicon-star" /> to save all your favorite Pictures <span className="glyphicon glyphicon-heart" /> and to share them with People like you !</p>
                        <form action="/users" method="post">
                            <input className="form-control" type="text" name="username" placeholder="Username..."/>
                            <br />
                            <input className="form-control" type="text" name="email" placeholder="Email"/>
                            <br />
                            <input className="form-control" type="password" name="password" placeholder="Password..."/>
                            <br />
                            <input className="form-control" type="submit" name="submit" placeholder="Submit"/>
                        </form>
                    </div>
                    <img className="img-responsive register" src="../../assets/images/render_689.png" />
                </div>
            </div>);
    }
});
module.exports = Client;