var common = require('../../elastic-core/common.js');
var pages = require('../../elastic-core/pages.js');


//API Agent = "Mozilla/5.0 (API; Linux x86_64; rv:25.0) Gecko/20100101 Firefox/25.0"
//WEB Agent = "Mozilla/5.0 (X11; Linux x86_64; rv:25.0) Gecko/20100101 Firefox/25.0"

exports.install = function() {
    F.route(pages.error401.uri, error401);
    F.route(pages.error403.uri, error403);
    F.route(pages.error404.uri, error404);
    F.route(pages.error408.uri, error408);
    F.route(pages.error431.uri, error431);
    F.route(pages.error500.uri, error500);
};


// Unauthorized
function error401() 
{
	var self = this;

	error(self, 401);
}

// Forbidden
function error403() 
{
	var self = this;

	error(self, 403);
}

// Not Found
function error404() 
{
	var self = this;

	error(self, 404);
}

// Request Timeout
function error408()
{
	var self = this;

	error(self, 408);
}

// Request Header Fields Too Large
function error431() 
{
	var self = this;

	error(self, 431);
}	

// Internal Server Error
function error500() 
{
	var self = this;

	error(self, 500);
}

function error(self, code) 
{
	if(self.req.url.contains('api')) {

		self.status = code;
		self.json({ code : code, status : utils.httpStatus(code).replace(code + ": ", ""), message: self.exception });

	} else {

		self.status = 200;

		common.model = {};
		common.model.pages = pages;
		common.model.page = pages.error;
		common.model.code = code;

		if(self.exception == null || self.exception == "") {
			common.model.message = utils.httpStatus(code).replace(code + ": ", "");
		} else {
			common.model.message = self.exception;
		}

		var page = common.make(self, pages.error.views);

		self.html(page);
	}
}
