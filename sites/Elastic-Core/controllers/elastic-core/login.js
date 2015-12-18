var common = require('../../elastic-core/common.js')
var pages = require('../../elastic-core/pages.js');

exports.install = function() {
	F.route(pages.login.uri, getLoginPage, pages.login.options);
	F.route(pages.login.uri, postLoginPage, pages.login.postOptions);
	F.route(pages.logout.uri, getLogoutPage, pages.logout.options);
};

// GET Login Page
function getLoginPage()
{
	var self = this;

	common.model = {};
	common.model.pages = pages;
	common.model.page = pages.login;
	common.model.message = '';
	common.model.email = '';

	var page = common.make(self, pages.login.views);

	self.html(page);
}

// POST Login Page
function postLoginPage()
{
	var self = this;

	common.EBLogin(self, function(result) {

		if(result.success == false) {

			common.model.message = "Invalid username or password.";
			common.model.email = self.post.email;

			var page = common.make(self, pages.login.views);			

			self.html(page);

		} else {

			self.redirect(pages.home.uri);
		}
	});
}

//GET Logout Page
function getLogoutPage()
{
	var self = this;

	common.model = {};
	common.model.page = pages.logout;

	common.EBLogout(self);

	self.redirect(pages.home.uri);
}
