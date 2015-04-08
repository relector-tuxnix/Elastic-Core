var common = require('../../elastic-core/common.js');
var pages = require('../../elastic-core/pages.js');

exports.install = function(framework) {
	framework.route(pages.apiLogin.uri, login, ['post', 'unauthorize']);
	framework.route(pages.apiLogout.uri, logout, ['get', 'authorize']);

	if(pages.apiRegister.active) {
		framework.route(pages.apiRegister.uri, register, ['post', 'unauthorize']);
	}

	framework.route(pages.apiSearch.uri, search, ['post']);
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
