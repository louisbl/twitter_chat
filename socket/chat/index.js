const channels = require('./channels');

module.exports = {
    namespace: '/chat',
    connect: function (io) {
        this.io = io.of(this.namespace);
        this.io.on('connection', this.init.bind(this))
    },
    init: function (socket) {
        channels.init(this.io, socket);
        socket.on('postMessage', this.onPostMessage.bind(this, this.io, socket));
        socket.on('disconnect', this.onDisconnect.bind(this, socket));
    },
    onPostMessage: function (io, socket, content) {
        const channel = channels.get(socket.user.channel);
        const message = {
            content: content,
            author: socket.user,
            date: new Date().toLocaleString()
        };
        channel.messages.push(message);
        this.io.to(channel.name).emit('newMessage', message);
    },
    onDisconnect: function (socket) {
        if (socket.user && socket.user.channel) {
            channels.removeUser(socket, socket.user);
        }
    }
};