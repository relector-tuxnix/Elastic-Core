var common = require('../../elastic-core/common.js')
var pages = require('../../elastic-core/pages.js');

exports.install = function(framework) {

	if(pages.register.active) {
		framework.route(pages.register.uri, getRegisterPage, pages.register.options);
		framework.route(pages.register.uri, postRegisterPage, pages.register.postOptions);
	}
};

// GET Register Page
function getRegisterPage()
{
	var self = this;

	common.model = {};
	common.model.pages = pages;
	common.model.page = pages.register;
	common.model.message = '';
	common.model.email = '';

	var page = common.make(self, pages.register.views);

	self.html(page);
}

//POST Register Page
function postRegisterPage()
{
	var self = this;

	common.EBRegister(self, function(result) {

		if(result.success == true) {

			self.redirect(pages.login.uri);

		} else {

			common.model.message = result.message;
			common.model.email = self.post.email;

			var page = common.make(self, pages.register.views);

			self.html(page)
		}	
	});
}
