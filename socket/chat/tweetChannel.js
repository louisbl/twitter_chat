var tweets = require('./../../twitter/core');

module.exports = {
    start: function (io, name) {
        tweets.track(name, function (event) {
            io.to(name).emit('tweet', event);
            // tweets.getHTLM(event.id, function (html) {})
        })
    }
}