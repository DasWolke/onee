/**
 * Created by julian on 05.03.2016.
 */
var React = require("react");
import ImageLoader from "react-imageloader";
function preloader() {
    return (<div className="loader">
        <img src="/assets/images/ajax.gif"/>
    </div>);
}
var imgProps = {
    className: "gallery"
};
var Image = React.createClass({
    checkThumbnail: function () {
        if (typeof (this.props.thumbnail) !== 'undefined' && this.props.thumbnail !== '/' && this.props.thumbnail.length > 1 && this.props.thumbnail !== '/undefined') {
            return this.props.thumbnail;
        } else {
            return "/i/" + this.props.url;
        }
    },
    render: function () {
        var thumbnail = this.checkThumbnail();
        console.log(thumbnail);
        return (
            <a href={"/i/" + this.props.url}>
                <ImageLoader
                    imgProps={imgProps}
                    wrapper={React.DOM.div}
                    src={thumbnail}
                    className="gallery"
                    preloader={preloader}>
                </ImageLoader>
            </a>
        )
    }
});
module.exports = Image;