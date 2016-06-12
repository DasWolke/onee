var React = require("react");
var ReactDOM = require("react-dom");
import Onee from './onee'
var Hallo = require("./asd.js");
import Register from "./register"
import App from './App'
import main_reducer from "../reducers/reducer-main"
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { syncHistoryWithStore, routerReducer} from 'react-router-redux'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
const createStoreFresh = compose(applyMiddleware(thunkMiddleware),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f)(createStore);
let store = createStoreFresh(main_reducer);
const history = syncHistoryWithStore(browserHistory, store);
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Onee}/>
                <Route path="/p/:id" component={Onee}/>
                <Route path="/register" component={Register}/>
                <Route path="/dash" component={Hallo}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById("react-app")
);