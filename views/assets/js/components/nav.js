/**
 * Created by julian on 05.03.2016.
 */
import React, { Component, PropTypes } from 'react'
import Login from './Login'
import Logout from './Logout'
import { Link, IndexLink } from 'react-router'
import { loginUser, logoutUser } from '../action/actions'
export default class Nav extends Component{
    render () {
        const { dispatch, isAuthenticated, errorMessage } = this.props;
        return (<nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <IndexLink className="navbar-brand lato" to="/">Onee.moe</IndexLink>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                        <li>
                            <IndexLink activeClassName="active" to="/" className="lato">Home</IndexLink>
                        </li>
                        <li>
                            {isAuthenticated &&
                            <Link activeClassName="active" to="/dash">Dashboard</Link>
                            }
                        </li>
                        {!isAuthenticated &&
                        <li>
                            <Link to="/register" className="lato">Register</Link>
                        </li>}
                        <li>
                            <div className='navbar-form'>

                                {!isAuthenticated &&
                                <Login
                                    errorMessage={errorMessage}
                                    onLoginClick={ creds => dispatch(loginUser(creds)) }
                                />
                                }

                                {isAuthenticated &&
                                <Logout onLogoutClick={() => dispatch(logoutUser())}/>
                                }

                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>);
    }

};
Nav.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string
};