var hb = require('handlebars');
var hbs = require('handlebars-form-helpers');

var hbh = require('./helpers.js');
var db = require('./database.js');

var $ = module.exports;

var defaultLimit = 50;

hbs.register(hb);


$.model = {}

$.make = function(self, view) {

	var source = self.view(view);

	var template = hb.compile(source);

	exports.model.user = self.user;

	var out = template(exports.model); 

	return out;
};

$.EBLogin = function(self, callback) {

	var auth = self.module('authorization');
	
	var id = self.post.email;
	var password = self.post.password;

	auth.login(self, {id: id, password: password}, 1000, function(result) {

		if(result == false) {
			callback({success: false, message: "Login failed."});

		} else {
			callback({success: true, message: "Login success." });
		}
	});
};

$.EBLogout = function(self) {

	var auth = self.module('authorization');

	auth.logoff(self, self.user.id);
};

$.EBRegister = function(self, callback) {

	var auth = self.module('authorization');

	var email = self.post.email;
	var password = self.post.password;
	var confirm = self.post.confirmPassword;

	db.client.count({
		index: 'users',
		body: {
			"query" : {
				"term": {
					"id" : email
				}
			}
		}
	}, function (err, exists) {

		if(err != null || exists.count > 0) {

			callback({success: false, message: "Username already exists."});

		} else {

			auth.cryptPassword(password, function(err, hash) {

				if(err != null) {

					console.log(err);
					callback({success: false, message: "An error has occurred. This has been reported. Thanks!"});
		
				} else {

					db.client.index({
						index: 'users',
						type: 'user',
						refresh: true,
						body: {
							id: email,
							password: hash,
							created: new Date()
						}
					}, function (err, response) {

						if(err == null) {
							
							callback({success: true, message: "User registration successful."});
							
						} else {

							console.log(err);
							callback({success: false, message: "An error has occurred. This has been reported. Thanks!"});
						}
					});
				}
			});
		}
	});
};

$.EBSearch = function(self, callback)
{
	var query = self.post.query;
	var last = self.post.last;
	var fields = self.post["fields[]"];
	var index = self.post.index;
	var type = self.post.type;
	var limit = self.post.limit;
	var body = {};

	console.log(fields);

	/*
	body.query = { 
		"multi_match" : {
			"query" : query.toLowerCase(), 
			"fields" : fields,
			"type" : "best_fields",
			"tie_breaker": 0.2
		}
	};
	*/

	/*
	body.query = { 
		"query_string" : {
			"query" : query.toLowerCase(), 
			"fields" : fields,
			"use_dis_max" : true
		}
	};
	*/

	body.query = {
		"fuzzy_like_this" : {
   			"fields" : fields,
     			"like_text" : query.toLowerCase(),
			"max_query_terms" : 12
    		}
	};

	if(last != null && last != "") {

		body.query.range = {
			"key" : {
				"lt" : last
			}	
		};
	}

	if(limit == null || limit == "") {
		limit = 0;
	}

	//Check if submitted limit is within specified bounds
        if(limit < 1 || limit > defaultLimit) {

                limit = defaultLimit;
        } 

	console.log(body);

	db.client.search({
		index: index,
		type: type,
		sort: "key:desc",
		size: limit,
		body: body
	}, function (error, response) {

		console.log(error);
		console.log(response);
	
		if(error == null) {

			var items = [];

			for(var i = 0; i < response.hits.hits.length; i++) {

				items.push(response.hits.hits[i]._source);
			}

			callback({success: true, message: items}); 

		} else {

			callback({success: false, message: "An error has occurred."});
		}
	});
};
