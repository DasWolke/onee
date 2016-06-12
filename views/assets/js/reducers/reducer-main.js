/**
 * Created by julian on 07.03.2016.
 */
import { combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux'
import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, SET_PAGE
} from '../action/actions'
var pageReducer = function (state, action) {
    if (typeof state === 'undefined') {
        return {
            page: 1
        };
    }
    switch (action.type) {
        case SET_PAGE:
            return Object.assign({}, state, {
                page: action.pageNumber
            });
        default:
            return state
    }
};
function auth(state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('id_token') ? true : false
}, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: false,
                user: action.creds
            })
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                errorMessage: ''
            })
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.message
            })
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: false
            })
        case REGISTER_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: false,
                user: action.creds
            })
        case REGISTER_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                errorMessage: ''
            })
        case REGISTER_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.message
            })
        default:
            return state
    }
}
const main_reducer = combineReducers({
    pageReducer, auth, routing: routerReducer
});
export default main_reducer