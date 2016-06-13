/**
 * Created by julian on 05.03.2016.
 */
var React = require("react");
import {connect} from 'react-redux'
var Images = require("./images.js");
var Drop = require('./drop.js');
var Pagination = require("./pagination.js");
var Header = require("./header.js");
import {setPageAction} from '../action/actions'
import ReactPaginate from 'react-paginate'
var Onee = React.createClass({
    loadImages: function (page) {
        $.ajax({
            url: this.state.url + "images/" + page,
            dataType: 'json',
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('#GET Error', status, err.toString());
            }.bind(this)
        });
    },
    maxPages: function () {
        $.ajax({
            url: this.state.url + "maxpage/",
            dataType: 'json',
            success: function (data) {
                this.setState({maxpage: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('#GET Error', status, err.toString());
            }.bind(this)
        })
    },
    getInitialState: function () {
        return {data: [], url: "/api/", maxpage: 1}
    },
    componentDidMount: function () {
        if (typeof(this.props.params.id) !== 'undefined') {
            this.props.pageChange(this.props.params.id);
        } else {
            this.loadImages(this.props.page);
        }
        this.maxPages();
    },
    changePage: function (data) {
        this.props.pageChange(data.selected+1);
        this.context.router.push('/p/' + parseInt(data.selected+1));
    },
    componentWillReceiveProps: function (nextProps) {
        this.loadImages(nextProps.page);
    },
    componentDidReceiveProps: function (nextProps) {
        this.context.router.push('/p/' + parseInt(nextProps.page));
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    render: function () {
        const {dispatch, isAuthenticated} = this.props;
        return (<div>
            <Header />

            <Images data={this.state.data}/>
            <ReactPaginate previousLabel={"previous"}
                           nextLabel={"next"}
                           pageNum={this.state.maxpage.length}
                           breakLabel={<span>...</span>}
                           initialSelected={this.props.page-1}
                           marginPagesDisplayed={2}
                           pageRangeDisplayed={5}
                           clickCallback={this.changePage}
                           containerClassName={"pagination"}
                           subContainerClassName={"pages pagination"}
                           activeClassName={"active"} />
            <Drop />
            {this.props.children}
        </div>);
    }
});
function mapStateToProps(state) {

    const {auth} = state;
    const {isAuthenticated, errorMessage} = auth;
    const {pageReducer} = state;
    const {page} = pageReducer;

    return {
        isAuthenticated,
        errorMessage,
        page
    };
}
function mapDispatchToProps(dispatch) {
    return {
        pageChange: (id) => {
            dispatch(setPageAction(id));
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Onee)