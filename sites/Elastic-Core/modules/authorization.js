/*
 * This authentication module implements IP pinning to a session.
 * This will prevent session hijacking if traffic is intecepted.
 * One session per {ID,IP,USER_AGENT} tuple.
 * You need a constant IP and USER-AGENT to ensure you retain your session!
 * Users of TOR will notice their session will die over time as their IP will change frequently.
 */

var bcrypt = require('bcrypt');
var events = require('events');

var USERAGENT = 20;


/*
 * expireCookie in days
 * expireSession in minutes
 */
function Users() {
	this.options = { cookie: '__user', secret: 'AbcUASOU389ASDadsl', expireSession: 60, expireCookie: 7 };
	this.framework = null;
	this.online = 0;
	this.users = {};
}

Users.prototype = new events.EventEmitter;
Users.prototype.onAuthorize = null;

Users.prototype.usage = function() {

	var self = this;

	return 'Online users: ' + self.online + ' ' + self.online.pluralize('users', 'user', 'users');
};

/*
 * Input:
 * 		Mozilla/5.0(X11;Li|ElasticBlog(DEBUG)1.00AtH101s84|Mozilla/5.0(X11;Li
 * 		Mozilla/5.0 (X11; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0
 * Output:
 * 		Mozilla/5.0(X11;Li
 */
Users.prototype.cleanAgent = function(agent) {

	agent = agent.split('|');

	return agent[0].substring(0, USERAGENT).replace(/\s/g, '');
}


Users.prototype.authorize = function(req, res, flags, callback) {

	var self = this;
	var options = self.options;
	var cookie = req.cookie(options.cookie) || '';

	if(!cookie || cookie.length < 10) {

		callback(false);
		return;
	}

	var keyValue = F.decrypt(cookie, options.secret, false);

	if(!keyValue) {

		callback(false);
		return;
	}

	var uniqueKey = keyValue.split(',');

	/* Check its the same user */
	if(uniqueKey.length != 3 || uniqueKey[1] !== req.ip || self.cleanAgent(uniqueKey[2]) !== self.cleanAgent(req.headers['user-agent'])) {

		callback(false);
		return;
	}

	var user = self.users[keyValue];

	if(user) {

		user.expire = F.datetime.add('m', self.options.expireSession);

		req.user = user.user;

		callback(true);

		return;
	}	

	callback(false);
};


/*
	Login a user
	@controller {Controller}
	@id {Number}
	@user {Object}
	@expire {Number} :: expire in minutes
	return {Users}
*/
Users.prototype.login = function(controller, user, callback) {

	var self = this;

	users.onAuthorize(user, function(regUser) {

		if(regUser) {

			var ip = controller.req.ip;
			var agent = self.cleanAgent(controller.req.headers['user-agent']);
			var uniqueKey = `${regUser._id},${ip},${agent}`;	

			self.users[uniqueKey] = { user: regUser, expire: F.datetime.add('m', self.options.expireSession).getTime() };
			self.refresh();
			self.emit('login', regUser._id, regUser);

			self._writeOK(uniqueKey, controller.req, controller.res);

			callback(true);

		} else {

			callback(false); 	
		}
	});
};

/*
	Logoff a user
	@controller {Controller}
	@id {Number}
	return {Users}
*/
Users.prototype.logoff = function(controller, id) {

	id = id.toString();

	var self = this;

	var ip = controller.req.ip;
	var agent = self.cleanAgent(controller.req.headers['user-agent']);
	var uniqueKey = `${id},${ip},${agent}`;	

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

	if(!length) {
		return self;
	}

	var expire = F.datetime;
	var users = self.users;

	for (var i = 0; i < length; i++) {
		var key = keys[i];
		var user = users[key];

		if(user.expire < expire) {
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
Users.prototype._writeOK = function(uniqueKey, req, res) {

	var self = this;

	res.cookie(self.options.cookie, F.encrypt(uniqueKey, self.options.secret), F.datetime.add('d', self.options.expireCookie));

	return this;
};


/*
	Internal
*/
Users.prototype._writeNO = function(res) {

	var self = this;

	res.cookie(self.options.cookie, '', F.datetime.add('y', -1));

	return self;
};


Users.prototype.cryptPassword = function(password, callback) {

	bcrypt.genSalt(10, function(err, salt) {

		if(err != null) {
			
			console.log(err);
			
			return callback(err, null);

		} else {

			bcrypt.hash(password, salt, function(err, hash) {				
				return callback(err, hash);
			});
		}
	});
};


Users.prototype.comparePassword = bcrypt.compare;

var users = new Users();

module.exports = users;
module.exports.name = module.exports.id = 'auth';
module.exports.version = '3.0.0';


function service(counter) {
	// Each 3 minutes
	counter % 3 === 0 && users.recycle();
}


function authorization(req, res, flags, callback) {

	if(users.onAuthorize) {

		users.authorize(req, res, flags, callback);

		return;
	}

	callback(false);
};


module.exports.install = function(options) {

	F.onAuthorize = authorization; 

	F.on('service', service);

	if(options) {
		users.options = U.copy(options);
	}

	this.emit('auth', users);
};


module.exports.uninstall = function() {

	if(F.onAuthorize === authorization) {
		F.onAuthorize = null;
	}

	F.removeListener('service', service);
};

