var $ = exports;

var common = require('../../elastic-core/common.js');


/* 
	GET Home Page
*/
$.home = function() {

	var self = this;

	common.model = {};
	common.model.hi = common.locale('howdy');

	common.ECQuery("SELECT * FROM User LIMIT 50", [], function(result) {

		common.model.artists = JSON.stringify(result.message);

		var page = common.make(self, common.pages.home);

		self.html(page);
	}); 
}
