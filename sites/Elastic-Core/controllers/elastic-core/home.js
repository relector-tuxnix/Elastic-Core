var common = require('../../elastic-core/common.js');
var pages = require('../../elastic-core/pages.js');

exports.install = function(framework) {
	framework.route(pages.home.uri, getHomePage, pages.home.options);
};

// GET Home Page
function getHomePage()
{
	var self = this;

	common.model = {};
	common.model.pages = pages;
	common.model.page = pages.home;
	common.model.hi = common.locale('howdy');

	var page = common.make(self, pages.home.views);

	self.html(page);
}

