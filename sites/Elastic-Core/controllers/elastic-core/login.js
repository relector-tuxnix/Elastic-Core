var $ = exports;

var common = require('../../elastic-core/common.js')

// GET Login Page
$.getLogin = function() {

	var self = this;

	common.model = {};
	common.model.message = '';
	common.model.email = '';

	var page = common.make(self, common.pages.getLogin);

	self.html(page);
};

// POST Login Page
$.postLogin = function() {

	var self = this;

	var email = self.body.email;
	var password = self.body.password;

	common.ECLogin(self, email, password, function(result) {

		if(result.success == false) {

			common.model.message = "Invalid username or password.";
			common.model.email = email;

			var page = common.make(self, common.pages.getLogin);			

			self.html(page);

		} else {

			self.redirect(common.pages.home.uri);
		}
	});
};

//GET Logout Page
$.logout = function() {

	var self = this;

	common.model = {};
	common.model.page = common.routes.logout.page;

	common.ECLogout(self);

	self.redirect(common.pages.home.uri);
};
