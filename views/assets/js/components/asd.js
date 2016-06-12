/**
 * Created by julian on 07.03.2016.
 */
var React = require("react");
var ReactDOM = require("react-dom");
var Four = require("./404.js");
var messages = [
    {
        "name": "#osu",
        "messages": [
            {
                "sender": "test1",
                "message": "test1msg",
                "id": "m1"
            }
        ]
    },
    {
        "name": "#german",
        "messages": [
            {
                "sender": "test2",
                "message": "test2msg",
                "id": "m2"
            }
        ]
    }
];

var Message = React.createClass({
    render: function () {
        return (
            <div className="message">
                <p>{this.props.from}: {this.props.children}</p>
            </div>
        );
    }
});

var Client = React.createClass({
    render: function () {
        const { isAuthenticated} = this.props;
        console.log(this.props);
        var channelNodes = messages.map(function (channel) {
            var messageNodes = channel.messages.map(function (message) {
                return (
                    <Message key={message.id} from={message.sender}>{message.message}</Message>
                );
            });
            return (
                <div>
                    <h1>{channel.name}</h1>
                    <div className="messageList">{messageNodes}</div>
                </div>);
        });

        return (
            <div>
                {isAuthenticated &&
                <div className="client">
                    {channelNodes}
                </div>
                }
                {!isAuthenticated &&
                <Four />}</div>

        );
    }
});
module.exports = Client;