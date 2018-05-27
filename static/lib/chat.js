var Chat = function (socket, params) {
    this.socket = socket;
    this.initElements(params.els);
    this.initEvents();
};

Chat.prototype.initElements = function (els) {
    this.channelsListEl = document.getElementById(els.channelsList);
    this.searchButtonEl = document.getElementById(els.searchButton);
    this.searchNameEl = document.getElementById(els.searchName);
    this.userNameEl = document.getElementById(els.userName);
    this.channelUsersListEl = document.getElementById(els.channelUsersList);
    this.channelUsersNumberEl = document.getElementById(els.channelUsersNumber);
    this.channelNameEl = document.getElementById(els.channelName);
    this.messagesListEl = document.getElementById(els.messagesList);
    this.tweetsListEl = document.getElementById(els.tweetsList);
    this.messageTextEl = document.getElementById(els.messageText);
    this.messageButtonEl = document.getElementById(els.messageButton);
    this.errorsEl = document.getElementById(els.errors);
    this.sections = document.querySelectorAll('.chat_section');
};

Chat.prototype.initEvents = function () {
    this.searchButtonEl.addEventListener('click', (function () {
        this.connectToChannel(this.searchNameEl.value, this.userNameEl.value);
    }).bind(this));
    this.messageButtonEl.addEventListener('click', this.sendMessage.bind(this))
};

Chat.prototype.isValidUser = function () {
    var username = this.userNameEl.value.trim();
    if (username === '') {
        this.showErrors(['Le pseudo est manquant !']);
        return false;
    }
    if (username.length < 3) {
        this.showErrors(['Le pseudo doit faire 3 caractères minimum !']);
        return false;
    }
    return true;
};

Chat.prototype.listen = function () {
    this.socket.on('newChannel', this.addChannel.bind(this));
    this.socket.on('removeChannel', this.removeChannel.bind(this));
    this.socket.on('getChannels', this.getChannels.bind(this));
    this.socket.on('joinChannel', this.joinChannel.bind(this));
    this.socket.on('newMessage', this.addMessage.bind(this));
    this.socket.on('newUser', this.addUserChannel.bind(this));
    this.socket.on('removeUser', this.removeUser.bind(this));
    this.socket.on('tweet', this.onTweet.bind(this));
};

Chat.prototype.getChannels = function (channels) {
    const channelsIds = Object.keys(channels);
    for (var i = 0; i < channelsIds.length; i++) {
        this.addChannel(channels[channelsIds[i]]);
    }
};

Chat.prototype.addChannel = function (channel) {
    var li = document.createElement('li');
    li.setAttribute('id', 'channel-' + channel.name);
    li.addEventListener('click', (function () {
        this.connectToChannel(channel.name, this.userNameEl.value);
    }).bind(this));
    li.innerText = channel.name;
    this.channelsListEl.appendChild(li);
};

Chat.prototype.connectToChannel = function (name, pseudo) {
    if (!this.isValidUser()) return;
    this.socket.emit('connectChannel', { pseudo: pseudo, name: name });
};

Chat.prototype.joinChannel = function (channel) {
    this.showSection('chat');
    this.initChannel(channel);
};

Chat.prototype.showSection = function (name) {
    this.clearErrors();
    for (var i = 0; i < this.sections.length; i++) {
        var section = this.sections[i];
        if (section.getAttribute('id') === name) section.style.display = 'block';
        else section.style.display = 'none';
    }
};

Chat.prototype.showErrors = function (errors) {
    this.clearErrors();
    for (var i = 0; i < errors.length; i++) {
        var error = document.createElement('li');
        error.innerText = errors[i];
        this.errorsEl.appendChild(error);
    }
};

Chat.prototype.clearErrors = function () {
    this.errorsEl.innerHTML = '';
};

Chat.prototype.initChannel = function (channel) {
    this.messagesListEl.innerHTML = '';
    this.tweetsListEl.innerHTML = '';
    this.channelNameEl.innerText = channel.name;
    var usersIds = Object.keys(channel.users);
    for (var i = 0; i < usersIds.length; i++) {
        this.addUserChannel(channel.users[usersIds[i]]);
    }
    for (var i = 0; i < channel.messages.length; i++) {
        this.addMessage(channel.messages[i]);
    }
};

Chat.prototype.addUserChannel = function (user) {
    var li = document.createElement('li');
    li.setAttribute('id', 'user-' + user.id);
    li.innerText = user.pseudo;
    this.channelUsersListEl.appendChild(li);
    this.channelUsersNumberEl.innerText = this.channelUsersListEl.childElementCount;
};

Chat.prototype.addMessage = function (message) {
    var li = document.createElement('li');
    var authorHTML = '<p>(' + message.date + ') ' + message.author.pseudo + ' dit :</p>';
    var messageHTML = '<p>' + message.content + '</p>';
    li.innerHTML = authorHTML + messageHTML;
    this.messagesListEl.appendChild(li);
};

Chat.prototype.sendMessage = function () {
    this.socket.emit('postMessage', this.messageTextEl.value);
    this.messageTextEl.value = '';
};

Chat.prototype.removeChannel = function (name) {
    var el = document.getElementById('channel-' + name);
    if (el) el.parentNode.removeChild(el);
};

Chat.prototype.removeUser = function (id) {
    var el = document.getElementById('user-' + id);
    if (el) el.parentNode.removeChild(el);
};

Chat.prototype.onTweet = function (tweet) {
    this.addTweet(tweet);
};

Chat.prototype.addTweet = function (tweet) {
    var li = document.createElement('li');
    li.innerHTML = '<p>' + tweet.text + '</p>';
    this.tweetsListEl.appendChild(li);
};