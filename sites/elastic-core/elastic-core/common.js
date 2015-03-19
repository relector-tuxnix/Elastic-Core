var hb = require('handlebars');
var hbs = require('handlebars-form-helpers');

var hbh = require('./helpers.js');
var db = require('./database.js');

var defaultLimit = 50;

hbs.register(hb);

exports.model = {}


exports.make = function(self, view) {

	var source = self.view(view);

	var template = hb.compile(source);

	exports.model.user = self.user;

	var out = template(exports.model); 

	return out;
};

exports.EBLogin = function(self, post, callback) {

	var auth = self.module('authorization');

	var user = { id: post.email, password: post.password };

	auth.login(self, user, 1000, function(result) {

		if(result == false) {
			callback({success: false, message: "Login failed."});

		} else {
			callback({success: true, message: "Login success." });
		}
	});
};

exports.EBLogout = function(self) {

	var auth = self.module('authorization');

	auth.logoff(self, self.user.id);
};

exports.EBRegister = function(self, post, callback) {

	var auth = self.module('authorization');

	var email = post.email;
	var password = post.password;
	var confirm = post.confirm;

	db.client.count({
		index: 'users',
		body: {
			"query": {
				"bool": {
					"must": [
						{ "match": { "id":  email }},
					]
				}
			}

		}
	}, function (error, exists) {

		if(exists.count > 0) {

			callback({success: false, message: "Username already exists."});

		} else {

			auth.cryptPassword(password, function(err, hash) {

				if(err != null) {

					callback({success: false, message: "An error has occurred. This has been reported. Thanks!"});
		
				} else {

					db.client.index({
						index: 'users',
						type: 'user',
						body: {
							id: email,
							password: hash,
							created: new Date().format('yyyy/MM/dd')
						}
					}, function (err, response) {

						if(err == null) {
							
							callback({success: true, message: "User registration successful."});
							
						} else {

							callback({success: false, message: "An error has occurred. This has been reported. Thanks!"});
						}
					});
				}
			});
		}
	});
};

exports.EBSearch = function(self, query, last, fields, index, type, limit, callback)
{
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
}

