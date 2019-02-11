var $ = exports;

var common = require('../../elastic-core/common.js')


/*
 * GET Register Page
 */
$.getRegister = function() {

	var self = this;

	common.model = {};

	var page = common.make(self, common.pages.getRegister);

	self.html(page);
}

