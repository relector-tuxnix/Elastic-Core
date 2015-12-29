var F = require('total.js');
var fs = require('fs');
var hb = require('handlebars');
var hbs = require('handlebars-form-helpers');

var hbh = require('./helpers.js');
var db = require('./database.js');

hbs.register(hb);

var $ = module.exports;

var defaultLimit = F.config['default-item-limit'];

$.model = {};

$.routes = {};

$.pages = {};

$.lang = F.config['default-language'];

$.locales = null;


/*
	Enable priority sorting of routes to allow site inheritance	
 */
$.registerPages = function(mappings) {
	
	for(var name in mappings) {

		var page = mappings[name];

		var add = true;

		/* We don't always have a controller defined when we are overriding parent mappings */
		if("controller" in page == false) {
			page.controller = undefined;
		}

		var newRoute = { "url" : page.uri, 
				 "controller" : page.controller,
				 "flags" : page.flags, 
				 "length" : undefined, 
				 "middleware" : undefined,
				 "timeout" : undefined,
				 "options" : undefined,
				 "priority" : 0,
				 "active" : true
			       };

		if("priority" in page) {
			newRoute.priority = page.priority;
		} else {
			page.priority = 0;
		}

		if("active" in page) {
			newRoute.active = page.active;
		} else {
			page.active = true;
		}
		
		/* If the route already exists, we need a priority to override it */	
		if(name in $.routes) {

			if(newRoute.priority < $.routes[name].priority) {

				add = false;
			}
		}

		if(add == true) {
			$.routes[name] = newRoute;

			$.pages[name] = page;
		}
	}
};

/*
	Now we have all the routes let total.js know about them.
 */
$.processRoutes = function() {

	for(var key in $.routes) {

		var route = $.routes[key];

		if(route.active == true) {
	
			/* Lets get the controller now that everything has actually loaded... we don't want circular reference issues! */
			var cont = "require('../controllers/" + route.controller + "')." + key;

			controller = eval(cont);

			console.log("REGISTERED MAPPING: " + key + " -> " + cont);

			F.route(route.url, controller, route.flags, route.length, route.middleware, route.timeout, route.options);
		}
	}
};

/*
	Lookup the locale keyword and return it.
 */
$.locale = function(keyword) {

	if($.locales == null) {

		var tmp = '';

		var filename = utils.combine(F.config['directory-locale'], $.lang + '.json');

		if(fs.existsSync(filename) == true) {

			tmp = fs.readFileSync(filename, 'utf-8');
		}

		if(tmp == '') {
			$.lang = F.config['default-language'];

			return '';
		}

		$.locales = JSON.parse(tmp);
	}

	return $.locales[keyword] || ''; 
}

$.make = function(self, page) {

	var out = "";

	$.model.user = self.user;
	
	$.model.locale = $.locale;

	$.model.pages = $.pages;

	$.model.page = page;


	for(var i = 0, len = $.model.page.views.length; i < len; i++) {

		var item = $.model.page.views[i];

		var modelKey = Object.keys(item)[0];

		var view = item[modelKey];

		var source = self.view(view);

		var template = hb.compile(source);

		//Last view is our final view
		if(i == $.model.page.views.length - 1) {

			out = template($.model);

		} else {

			$.model[modelKey] = template($.model);
		}
	}

	return out;
};

$.EBGetById = function(self, id, index, type, callback)
{
	var body = {};

	db.client.get({
		index: index,
		type: type,
		size: 1,
		id: id
	}, function (error, response) {

		if(error == null && response != null && response._source !=  null) {

			callback({success: true, message: response._source}); 

		} else {

			callback({success: false, message: "An error has occurred."});
		}
	});	
};

$.EBDelete = function(self, id, index, type, callback)
{
	db.client.delete({
		index: index,
		type: type,
		id: id,
		refresh: true
	}, function (err, response) {

		if(err == null) {

			callback({success: true, message: "Deleted."});

		} else {

			callback({success: false, message: "Failed to delete."});
		}
	});
};

$.EBLogin = function(self, callback) {

	var auth = self.module('authorization');
	
	var id = self.post.email;
	var password = self.post.password;

	auth.login(self, {id: id, password: password}, function(result) {

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

					callback({success: false, message: "An error has occurred. This has been reported. Thanks!"});
		
				} else {

					var timestamp = new Date().format('yyyy/MM/dd');

					db.client.index({
						index: 'users',
						type: 'user',
						id: email,
						refresh: true,
						body: {
							id: email,
							password: hash,
							updated: timestamp,
							created: timestamp
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

$.EBSearch = function(self, callback)
{
	var query = self.post.query;
	var last = self.post.last;
	var fields = self.post["fields[]"];
	var index = self.post.index;
	var type = self.post.type;
	var limit = self.post.limit;
	var body = {};

	body.query = {
		"multi_match" : {  
        		"fields" : fields,
   			"query" : query.toLowerCase(),
			"fuzziness" : "AUTO"
		}
	};

	body.filter = {
		"bool" : {
			"must" : [
				{"match" : { "live" : true }},
				{"match" : { "group" : "summary" }}
			]
		}
	};
	
	if(last != null && last != "") {
		body.filter.bool.must.push({"range" : { "key" : { "lt" : last }}});
	}

	if(limit == null || limit == "") {
		limit = 0;
	}

	//Check if submitted limit is within specified bounds
        if(limit < 1 || limit > defaultLimit) {
		limit = defaultLimit;
        } 

	db.client.search({
		index: index,
		type: type,
		sort: "key:desc",
		size: limit,
		body: body
	}, function (error, response) {

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
