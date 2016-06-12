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
            this.props.dispatch(setPageAction(parseInt(this.props.params.id)));
        }
        this.loadImages(this.props.page);
        this.maxPages();
    },
    changePage: function (pageNum) {
        
    },
    componentWillReceiveProps: function () {
        this.loadImages(this.props.page);
    },
    render: function () {
        const {dispatch, isAuthenticated} = this.props;
        return (<div>
            <Header />

            <Images data={this.state.data}/>
            <Pagination pages={this.state.maxpage} curPage={this.props.page} cb={function(pageNum) {
            dispatch(setPageAction(pageNum))
            }}/>
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
export default connect(mapStateToProps)(Onee)