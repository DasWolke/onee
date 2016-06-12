/**
 * Created by julian on 07.03.2016.
 */
import { connect } from 'react-redux'
import { loginUser } from '../action/actions'
import React, { Component, PropTypes } from 'react'
import Nav from './nav'
class App extends Component{
    render () {
        const { dispatch, isAuthenticated, errorMessage } = this.props;
        return (
            <div>
                <Nav isAuthenticated={isAuthenticated} errorMessage={errorMessage} dispatch={dispatch}/>
                {this.renderChildren(dispatch, errorMessage, isAuthenticated)}
            </div>);
    }
    renderChildren (dispatch, errorMessage, isAuthenticated) {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                dispatch:dispatch, errorMessage:errorMessage, isAuthenticated: isAuthenticated
            });
        });
    }
}
App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string
};
function mapStateToProps(state) {

    const { auth } = state;
    const { isAuthenticated, errorMessage } = auth;

    return {
        isAuthenticated,
        errorMessage
    }
}
export default connect(mapStateToProps)(App)