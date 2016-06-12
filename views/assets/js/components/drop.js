/**
 * Created by julian on 05.03.2016.
 */
var React = require("react");
var ReactDOM = require("react-dom");
var Drop = React.createClass({
        render: function() {
            return(
                <div className="col-md-12 col-xs-12 col-lg-12">
                    <form id="upload" action="/i/up" className="dropzone" encType="multipart/form-data" method="post">
                        <div className="fallback">
                            <input name="file" type="file" multiple/>
                        </div>
                        <p className="dz-message lato">Drop Files here to upload</p>
                    </form>
                </div>
            )
        }
    });
module.exports = Drop;