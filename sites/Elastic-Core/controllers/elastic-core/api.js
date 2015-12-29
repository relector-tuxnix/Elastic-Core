var $ = exports;

var common = require('../../elastic-core/common.js');


$.apiGetById = function() {

	var self = this;

	var id = self.post.id;
       	var index = self.post.index;
        var type = self.post.type;

	common.EBGetById(self, id, index, type, function(results) {

		if(results.success == false) {
			
			self.view500(results.message);
			
		} else {

			self.json(results.message);
		}
	});
};

$.apiDeleteById = function() {

	var self = this;

	var id = self.post.id;
	var index = self.post.index;
	var type = self.post.type;

	common.EBDelete(self, id, index, type, function(results) {

		if(results.success == false) {
	
			self.view500(results.message);

		} else {

			self.json(results);
		}
	});
};

$.apiLogin = function() {

	var self = this;

	common.EBLogin(self, function(result) {

		self.json(result);
	});
};

$.apiRegister = function() {

	var self = this;

	common.EBRegister(self, function(result) {

		self.json(result);
	});
};

$.apiLogout = function() {

	var self = this;

	common.EBLogout(self);

	self.json({ message: "Successfully logged off." });
};

$.apiSearch = function() {

	var self = this;

	common.EBSearch(self, function(results) {

		if(results.success == false) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
};

$.apiSetLanguage = function() {

	var self = this;

	common.lang = self.post.lang;
};
