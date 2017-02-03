var $ = exports;

var common = require('../../elastic-core/common.js');


$.apiGetMany = function() {

	var self = this;

	var range = self.body["range[]"];
	var last = self.body["last[]"];
	var order = self.body["order[]"];
	var limit = self.body.limit;
	var type = self.body.type;
	
	common.ECGet([`_type = "${type}"`], limit, last, range, order, function(results) {

		if(results.error == true) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
};


$.apiGetById = function() {

	var self = this;

	var key = self.body.key;

	common.ECGet([`_key = "${key}"`], 1, [], [], [], function(results) {

		if(results.error == true) {
			
			self.view500(results.message);
			
		} else {

			self.json(results.message);
		}
	});
};


$.apiDeleteById = function() {

	var self = this;

	var key = self.body.key;

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

	var email = self.body.email.toUpperCase();
	var password = self.body.password;

	common.ECLogin(self, email, password, function(result) {

		self.json(result);
	});
};


$.apiRegister = function() {

	var self = this;

	var email = self.body.email.toUpperCase();
	var password = self.body.password;
	var confirm = self.body.confirm;

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


$.apiSearch = function() {

	var self = this;

	var query = self.body.query;

	common.ECSearch(query, 10, function(results) {

		if(results.success == false) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
};


$.apiSetLanguage = function() {

	var self = this;

	common.lang = self.body.lang;
};
