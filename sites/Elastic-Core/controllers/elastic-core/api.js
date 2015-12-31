var $ = exports;

var common = require('../../elastic-core/common.js');

$.apiGetMany = function() {

	var self = this;

	var from = self.post.from;
	var to = self.post.to;
	var last = self.post.last;
       	var index = self.post.index;
        var type = self.post.type;
	var limit = self.post.limit;
	var sort = self.post.sort;
	
	var body = {
		"query" : {	
			"bool" : {
				"must" : []
			}
		}
	};

	if(from != "" && to != "") {
		body.query.bool.must.push({"range" : { "created" : { "from" : from, "to" : to }}});
	}

	if(last != null && last != "") {
		body.query.bool.must.push({"range" : { "key" : { "lt" : last }}});
	}

	common.EBGetMany(index, type, body, limit, sort, function(results) {

		if(results.success == false) {
			
			self.view500(results.message);
			
		} else {

			self.json(results);
		}
	});
};

$.apiGetById = function() {

	var self = this;

	var id = self.post.id;
       	var index = self.post.index;
        var type = self.post.type;

	common.EBGetById(id, index, type, function(results) {

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

	common.EBDelete(id, index, type, function(results) {

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

	var query = self.post.query;
	var last = self.post.last;
	var fields = self.post["fields[]"];
	var limit = self.post.limit;
	var sort = self.post.sort;
	var index = self.post.index;
	var type = self.post.type;

	common.EBSearch(query, last, limit, fields, sort, index, type, {}, function(results) {

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
