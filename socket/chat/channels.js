var tweetChannel = require("./tweetChannel");

module.exports = {
    channels: {},
    get: function (name) {
        return this.channels[name]
    },
    init: function (io, socket) {
        this.io = io;
        socket.emit('getChannels', this.channels);
        socket.on('connectChannel', this.onConnectChannel.bind(this, io, socket));
    },
    channelExist: function (name) {
        return typeof this.channels[name] !== 'undefined'
    },
    createChannel: function (io, name) {
        this.channels[name] = {
            name: name,
            users: {},
            messages: []
        };
        this.io.emit('newChannel', this.channels[name]);
        tweetChannel.start(this.io, name);
    },
    addUserChannel: function (name, user) {
        this.channels[name].users[user.id] = user;
    },
    onConnectChannel: function (io, socket, data) {
        if (data.pseudo.trim() === '' || data.name.trim() === '') return;
        socket.user = { id: socket.id, pseudo: data.pseudo, channel: data.name };
        if (!this.channelExist(data.name)) this.createChannel(io, data.name);
        this.addUserChannel(data.name, socket.user);
        socket.join(data.name);
        socket.emit('joinChannel', this.get(data.name));
        socket.broadcast.to(data.name).emit('newUser', socket.user);
    },
    removeUser: function (socket, user) {
        const channel = this.get(user.channel);
        delete channel.users[user.id];
        socket.broadcast.to(user.channel).emit('removeUser', user.id);
        if (Object.keys(channel.users).length === 0) {
            this.removeChannel(channel.name);
        }
    },
    removeChannel: function (name) {
        delete this.channels[name];
        this.io.emit('removeChannel', name);
    }
};