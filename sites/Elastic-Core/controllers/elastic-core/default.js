var $ = exports;

var common = require('../../elastic-core/common.js');

//API Agent = "Mozilla/5.0 (API; Linux x86_64; rv:25.0) Gecko/20100101 Firefox/25.0"
//WEB Agent = "Mozilla/5.0 (X11; Linux x86_64; rv:25.0) Gecko/20100101 Firefox/25.0"

// Unauthorized
$.error401 = function() {

	var self = this;

	$.handleError(self, 401);
};

// Forbidden
$.error403 = function() {

	var self = this;

	$.handleError(self, 403);
};

// Not Found
$.error404 = function() {

	var self = this;

	$.handleError(self, 404);
};

// Request Timeout
$.error408 = function() {

	var self = this;

	$.handleError(self, 408);
};

// Request Header Fields Too Large
$.error431 = function() {

	var self = this;

	$.handleError(self, 431);
};	

// Internal Server Error
$.error500 = function() {

	var self = this;

	$.handleError(self, 500);
};

// Generic error
$.error = function() {

	var self = this;

	$.handleError(self, 200);
};

$.handleError = function(self, code) {

	if(self.req.url.contains('api')) {

		self.status = code;
		
		/* The front end exception view expects an array of messages */
		if(Array.isArray(self.exception) == true) {
			message = self.exception;	
		} else {
			message = [self.exception];
		}

		self.json({ code : code, status : utils.httpStatus(code).replace(code + ": ", ""), message: message });

	} else {

		self.status = 200;

		common.model = {};
		common.model.code = code;

		if(self.exception == null || self.exception == "") {
			common.model.message = utils.httpStatus(code).replace(code + ": ", "");
		} else {
			common.model.message = self.exception;
		}

		var page = common.make(self, common.pages.error);

		self.html(page);
	}
};
