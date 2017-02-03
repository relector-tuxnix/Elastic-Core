var $ = exports;

var common = require('../../elastic-core/common.js')

// GET Register Page
$.getRegister = function() {

	var self = this;

	common.model = {};
	common.model.message = '';
	common.model.email = '';

	var page = common.make(self, common.pages.getRegister);

	self.html(page);
}

//POST Register Page
$.postRegister = function() {

	var self = this;

	common.EBRegister(self, function(result) {

		if(result.success == true) {

			self.redirect(common.pages.getLogin.uri);

		} else {

			common.model.message = result.message;
			common.model.email = self.body.email;

			var page = common.make(self, common.pages.getRegister);

			self.html(page)
		}	
	});
};
