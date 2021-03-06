var React = require("react");
var ReactDOM = require("react-dom");
var LI = require('./pagi-single');
var Pagination = React.createClass({
    handleClick: function (num) {
        var changePage = this.props.cb;
        changePage(parseInt(num));
    },
    render: function () {
        var pagenodes = [];
        for (var i = 0; i < this.props.pages.length; i++) {
            pagenodes.push(<LI cb={this.handleClick} num={i+1} key={i+1}/>);
        }
        var maxpage = 10;
        var minpage = 1;
        if (parseInt(this.props.curPage) + 6 >= pagenodes.length) {
            maxpage = pagenodes.length;
        } else {
            maxpage = parseInt(this.props.curPage) + 6;
        }
        if (this.props.curPage <= 5) {
            minpage = 0;
        } else {
            minpage = this.props.curPage -4;
        }
        console.log(maxpage);
            var pages = pagenodes.slice(minpage, maxpage);

        return (
            <div className="col-md-10 col-xs-12 col-lg-10 col-md-offset-1 col-lg-offset-1">
                <ul className="pagination">
                    {pages}
                </ul>
            </div>
        )
    }
});
module.exports = Pagination;
