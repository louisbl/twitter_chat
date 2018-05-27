var chat = require('./chat');

module.exports = {
    start: function (io) {
        chat.connect(io);
    }
};