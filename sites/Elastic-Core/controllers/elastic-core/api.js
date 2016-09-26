var $ = exports;

var common = require('../../elastic-core/common.js');


$.apiGetMany = function() {

	var self = this;

	var limit = self.post.limit;
	var last = self.post.last;
	var from = self.post.from;
	var to = self.post.to;
	var order = self.post.order;
	var type = self.post.type;
	
	common.ECGet({'_type' : type}, limit, last, from, to, order, function(results) {

		if(results.error == true) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
};


$.apiGetById = function() {

	var self = this;

	var key = self.post.key;

	common.ECGet({'_key' : key}, 1, '', '', '', '', function(results) {

		if(results.error == true) {
			
			self.view500(results.message);
			
		} else {

			self.json(results.message);
		}
	});
};


$.apiDeleteById = function() {

	var self = this;

	var key = self.post.key;

	common.ECDelete(key, function(results) {

		if(results.error == true) {
	
			self.view500(results.message);

		} else {

			self.json(results);
		}
	});
};


$.apiLogin = function() {

	var self = this;

	var email = self.post.email.toUpperCase();
	var password = self.post.password;

	common.ECLogin(self, email, password, function(result) {

		self.json(result);
	});
};


$.apiRegister = function() {

	var self = this;

	var email = self.post.email.toUpperCase();
	var password = self.post.password;
	var confirm = self.post.confirm;

	var constraints = {
		"email": {
			presence: true,
	  		email: true,
		},
		"password": {
			presence: true,
	  		length: {
				minimum: 5
	  		}
	  	},
	  	"confirm": {
			presence: true,
			equality: {
				attribute: "password",
				message: "^The passwords do not match!"
			}
		}
	};

	var failed = common.validate({"email": email, "password": password, "confirm": confirm}, constraints, {format: "flat"});

	if(failed == undefined) {

		common.ECRegister(self, email, password, function(result) {

			self.json(result);
		});

	} else {

		self.json({success: false, message: failed});
	}
};


$.apiLogout = function() {

	var self = this;

	common.ECLogout(self);

	self.json({ message: "Successfully logged off." });
};

/*
$.apiSearch = function() {

	var self = this;

	var query = self.post.query;
	var fields = self.post["fields[]"];
	var table = self.post.table;
	var limit = self.post.limit;

	common.ECSearch(query, table, fields, limit, function(results) {

		if(results.success == false) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
};
*/

$.apiSetLanguage = function() {

	var self = this;

	common.lang = self.post.lang;
};
