var bcrypt = require('bcrypt-nodejs');
var events = require('events');

var SUGAR = 'ABCD1234';
var USERAGENT = 20;

// expireCookie in days
// expireSession in minutes

function Users() {
	this.options = { cookie: '__user', secret: 'AbcUASOU389ASDadsl', expireSession: 60, expireCookie: 7 };
	this.framework = null;
	this.online = 0;
	this.users = {};
}

Users.prototype.usage = function() {
	var self = this;
	return 'Online users: ' + self.online + ' ' + self.online.pluralize('users', 'user', 'users');
};

Users.prototype = new events.EventEmitter;

/*
	Authorize user
	@id {Number}
	@callback {Function} :: callback must have as parameter an object or null value
*/
Users.prototype.onAuthorization = null;

Users.prototype._onAuthorization = function(req, res, flags, callback) {

	var self = this;
	var framework = self.framework;
	var options = self.options;
	var cookie = req.cookie(options.cookie) || '';

	if (cookie === '' || cookie.length < 10) {
		callback(false);
		return;
	}

	var value = framework.decrypt(cookie, options.secret, false);

	if (value === null) {
		callback(false);
		return;
	}

	var arr = value.split('|');

	if (arr.length != 2 || arr[1] !== SUGAR) {

		callback(false);
		return;
	}

	var uniqueKey = arr[0].split(',');

	if(uniqueKey.length != 3 || uniqueKey[1] != req.ip || uniqueKey[2]!== req.headers['user-agent'].substring(0, USERAGENT).replace(/\s/g, '')) {
	
		callback(false);
		return;
	}

	var id = arr[0];

	var user = self.users[id];

	if (user) {
		user.expire = new Date().add('m', self.options.expireSession);

		req.user = user.user;
		
		callback(true);
		
		return;
	}

	callback(false);
};

/*
	Login an user
	@controller {Controller}
	@id {Number}
	@user {Object}
	@expire {Number} :: expire in minutes
	return {Users}
*/
Users.prototype.login = function(controller, user, callback) {

	var self = this;

	self.onAuthorization(user, function(user) {

		if(user) {
			var ip = controller.req.ip;
			var agent = controller.req.headers['user-agent'].substring(0, USERAGENT).replace(/\s/g, '');
			var uniqueKey = user.id + "," + ip + "," + agent;
			
			self.users[uniqueKey] = { user: user, expire: new Date().add('m', self.options.expireSession) };

			controller.req.user = user;
		
			self.refresh();
			self.emit('login', user.id, user);
			self._writeOK(uniqueKey, controller.req, controller.res);

			callback(true);

		} else {
			callback(false); 	
		}
	});
};

/*
	Logoff an user
	@controller {Controller}
	@id {Number}
	return {Users}
*/
Users.prototype.logoff = function(controller, id) {

	id = id.toString();

	var ip = controller.req.ip;
	var agent = controller.req.headers['user-agent'].substring(0, USERAGENT).replace(/\s/g, '');
	var uniqueKey = id + "," + ip + "," + agent;

	var self = this;

	var user = self.users[uniqueKey];

	delete self.users[uniqueKey];
	self._writeNO(controller.res);

	self.refresh();
	self.emit('logoff', id, user || null);

	return self;
};

/*
	Internal
*/
Users.prototype.refresh = function() {
	var self = this;
	var keys = Object.keys(self.users);

	self.online = keys.length;
	self.emit('online', self.online);

	return self;
};

/*
	Internal
*/
Users.prototype.recycle = function() {

	var self = this;
	var keys = Object.keys(self.users);
	var length = keys.length;

	if (length === 0)
		return self;

	var expire = new Date();
	var users = self.users;

	for (var i = 0; i < length; i++) {
		var key = keys[i];
		var user = users[key];

		if (user.expire < expire) {
			self.emit('expire', key, user.user);

			delete users[key];
		}
	}

	self.refresh();
	return self;
};

/*
	Internal
*/
Users.prototype._writeOK = function(id, req, res) {
	var self = this;
	var framework = self.framework;
	var value = id + '|' + SUGAR;

	res.cookie(self.options.cookie, framework.encrypt(value, self.options.secret), new Date().add('d', self.options.expireCookie));

	return this;
};

/*
	Internal
*/
Users.prototype._writeNO = function(res) {
	var self = this;
	res.cookie(self.options.cookie, '', new Date().add('y', -1));
	return self;
};

Users.prototype.cryptPassword = function(password, callback) {

	bcrypt.genSalt(10, function(err, salt) {

		if(err != null) {
			
			console.log(err);
			
			return callback(err, null);

		} else {

			bcrypt.hash(password, salt, null, function(err, hash) {				
				return callback(err, hash);
			});
		}
	});
};

Users.prototype.comparePassword = bcrypt.compare;


module.exports = new Users();

module.exports.install = function() {

	SUGAR = (framework.config.name + framework.config.version + SUGAR).replace(/\s/g, '');

	framework.onAuthorize = function(req, res, flags, callback) {

		if(users.onAuthorization !== null) {

			users._onAuthorization(req, res, flags, callback);

			return;
		}

		callback(false);
	};

	framework.on('service', function(counter) {
		users.recycle();
	});

	this.framework = framework;
};


var users = module.exports;
