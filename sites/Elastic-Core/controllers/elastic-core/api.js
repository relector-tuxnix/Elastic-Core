var $ = exports;

var common = require('../../elastic-core/common.js');


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

		if(result.error == true) {
	
			self.view500(result.message);

		} else {

			self.json(result);
		}
	});
};


$.apiRegister = function() {

	var self = this;

	var email = self.body.email.toUpperCase();
	var password = self.body.password;
	var passwordConfirm = self.body.passwordConfirm;

	common.ECRegister(self, email, password, passwordConfirm, function(results) {

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


