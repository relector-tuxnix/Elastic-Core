var common = require('../../elastic-core/common.js');
var pages = require('../../elastic-core/pages.js');

exports.install = function(framework) {
	framework.route(pages.apiLogin.uri, login, ['post', 'unauthorize']);
	framework.route(pages.apiLogout.uri, logout, ['authorize']);
	framework.route(pages.apiRegister.uri, register, ['post', 'unauthorize']);
	framework.route(pages.apiSearch.uri, search, ['post']);
};

function login()
{
	var self = this;

	var post = {
		"email" : self.post.email,
		"password" : self.post.password
	};

	common.EBLogin(self, post, function(result) {

		self.json(result);
	});
}

function register()
{
	var self = this;

	var post = {
		"email" : self.post.email,
		"password" : self.post.password,
		"confirm" : self.post.confirmPassword
	};

	common.EBRegister(self, post, function(result) {

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

	var query = self.post.query;
	var last = self.post.last;
	var fields = self.post["fields[]"];
	var index = self.post.index;
	var type = self.post.type;
	var limit = self.post.limit;

	common.EBSearch(self, query, last, fields, index, type, limit, function(results) {

		if(results.success == false) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
}
