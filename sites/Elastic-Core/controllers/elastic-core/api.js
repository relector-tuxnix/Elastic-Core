var common = require('../../elastic-core/common.js');
var pages = require('../../elastic-core/pages.js');

exports.install = function(framework) {
	framework.route(pages.apiLogin.uri, login, pages.apiLogin.options);
	framework.route(pages.apiLogout.uri, logout, pages.apiLogout.options);

	if(pages.apiRegister.active) {
		framework.route(pages.apiRegister.uri, register, pages.apiRegister.options);
	}

	framework.route(pages.apiSearch.uri, search, pages.apiSearch.options);
	framework.route(pages.apiSetLanguage.uri, setLanguage, pages.apiSearch.options);
};

function login()
{
	var self = this;

	common.EBLogin(self, function(result) {

		self.json(result);
	});
}

function register()
{
	var self = this;

	common.EBRegister(self, function(result) {

		self.json(result);
	});
}

function logout()
{
	var self = this;

	common.EBLogout(self);

	self.json({ message: "Successfully logged off." });
}

function search()
{
	var self = this;

	common.EBSearch(self, function(results) {

		if(results.success == false) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
}

function setLanguage()
{
	var self = this;

	common.lang = self.post.lang;
}
