var client = require('./client');

module.exports = {
    track: function (keyword, callback) {
        client.stream('statuses/filter', { track: keyword }, function (stream) {
            stream.on('data', function(event) {
                callback(event);
            });
            stream.on('error', function(error) {
                throw error;
            });
        });
    },
    getHTLM: function (id, callback) {
        client.get('statuses/show', { id: id }, callback)
    }
};