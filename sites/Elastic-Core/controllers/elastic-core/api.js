var $ = exports;

var common = require('../../elastic-core/common.js');


$.apiGetMany = function() {

	var self = this;

	var table = self.body.table;
	var columns = self.body["columns[]"];
	var where = self.body["where[]"];
	var range = self.body["range[]"];
	var order = self.body["order[]"];
	var limit = self.body.limit;

	common.ECGet(table, columns, where, range, order, limit, function(results) {

		if(results.error == true) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
};


$.apiDeleteById = function() {

	var self = this;

	var table = self.body.table;
	var key = self.body.key;
	var value = self.body.value;
	
	common.ECDelete(table, key, value, function(results) {

		if(results.error == true) {
	
			self.view500(results.message);

		} else {

			self.json(results);
		}
	});
};


$.apiLogin = function() {

	var self = this;

	var email = self.body.email;
	var password = self.body.password;

	common.ECLogin(self, email, password, function(result) {

		if(results.error == true) {
	
			self.view500(results.message);

		} else {

			self.json(results);
		}
	});
};


$.apiRegister = function() {

	var self = this;

	var email = self.body.email.toUpperCase();
	var password = self.body.password;
	var confirm = self.body.confirm;

	common.ECRegister(self, email, password, confirm, function(results) {

		if(results.error == true) {
	
			self.view500(results.message);

		} else {

			self.json(results);
		}
	});
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


