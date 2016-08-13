var F = require('total.js');
var fs = require('fs');
var hb = require('handlebars');
var path = require('path');
var hbs = require('handlebars-form-helpers');
var val = require("validate.js");

var hbh = require('./helpers.js');
var db = require('./database.js');

hbs.register(hb);

var $ = module.exports;

$.model = {};

$.routes = {};

$.pages = {};

$.defaultLimit = null;

$.defaultTheme = null;

$.locales = null;

$.validate = val.validate;


F.once('load', function() {
 
	$.defaultLimit = F.config['default-item-limit'];

	$.defaultTheme = F.config['default-theme'];

	/* Have to hard code the path as core does not do themes and there can only be one configuration */
	var pages = require('./elastic-core-pages.js');

	$.registerPages(pages);

	/* We don't want to process routes as they are processed by the child site */
	//$.processRoutes();

	$.EBSetupAuthentication();

	console.log("LOADED ELASTIC-CORE!");
});


$.EBSetupAuthentication = function() { 

	var auth = MODULE('authorization');

	auth.onAuthorization = function(user, callback) {

		$.EBGetById(user.id, 'users', 'user', function(result) {

			if(result.success == true) {

				var storedUser = result.message;

				auth.comparePassword(user.password, storedUser.password, function(err, isMatch) {
					
					if(isMatch == true) {

						callback(storedUser);

					} else {
						
						callback(null);
					}
				});

			} else {
				callback(null);
			}
		});
	};
};


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

		var filename = utils.combine(F.config['directory-locale'], $.defaultTheme);

		filename = path.join(filename, F.config['default-language']);

		filename = filename + '.json';

		if(fs.existsSync(filename) == true) {

			var tmp = fs.readFileSync(filename, 'utf-8');

			$.locales = JSON.parse(tmp);

		} else {

			$.locales = {};
		} 
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

$.EBGetMany = function(index, type, body, limit, sort, callback)
{
	if(limit == null || limit == "") {
		limit = 0;
	}

	 //Check if submitted limit is within specified bounds
        if(limit < 1 || limit > $.defaultLimit) {
                limit = $.defaultLimit;
        } 

	db.client.search({
		index: index,
		type: type,
		sort: sort,
		size: limit,
		body: body
	}, function (err, response) {

		if(err == null) {

			var items = [];

			for(var i = 0; i < response.hits.hits.length; i++) {

				items.push(response.hits.hits[i]._source);
			}

			callback({success: true, message: items}); 

		} else {

			console.log(err);

			callback({success: false, message: "An error has occurred."});
		}
	});
};

$.EBGetById = function(id, index, type, callback) {

	db.client.get({
		index: index,
		type: type,
		size: 1,
		id: id
	}, function (err, response) {
	
		if(err == null && response != null && response._source !=  null) {

			callback({success: true, message: response._source}); 

		} else {

			console.log(err);

			callback({success: false, message: "An error has occurred."});
		}
	});	
};

$.EBIndex = function(id, body, index, type, callback) {

	db.client.index({
		index: index,
		type: type,
		id: id,
		body: body,
		refresh: true
	}, function(err, response) {

		if(err == null) {
			
			if(response.created == true) {

				callback({success: true, message: "Saved.", created: true});

			} else {

				callback({success: true, message: "Updated.", created: false});
			}	
			
		} else {

			console.log(err);

			callback({success: false, message: "An error has occurred.", created: false});
		}
	});
};

$.EBDelete = function(id, index, type, callback)
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

			console.log(err);

			callback({success: false, message: "Failed to delete."});
		}
	});
};

$.EBLogin = function(self, id, password, callback) {

	var auth = self.module('authorization');

	auth.login(self, {id: id, password: password}, function(result) {

		if(result == false) {

			callback({success: false, message: ["Login failed."]});

		} else {

			callback({success: true, message: ["Login success."]});
		}
	});
};

$.EBLogout = function(self) {

	var auth = self.module('authorization');

	auth.logoff(self, self.user.id);
};

$.EBRegister = function(self, id, password, callback) {

	var auth = self.module('authorization');

	$.EBGetById(id, 'users', 'user', function(result) {

		if(result.success == true) {

			callback({success: false, message: ["Username already exists."]});

		} else {

			auth.cryptPassword(password, function(err, hash) {

				if(err != null) {

					console.log(err);

					callback({success: false, message: ["An error has occurred. This has been reported. Thanks!"]});
		
				} else {

					var timestamp = new Date().format('yyyy/MM/dd');

					db.client.index({
						index: 'users',
						type: 'user',
						id: id,
						refresh: true,
						body: {
							id: id,
							password: hash,
							updated: timestamp,
							created: timestamp
						}
					}, function (err, response) {

						if(err == null) {
							
							callback({success: true, message: ["User registration successful."]});
							
						} else {

							console.log(err);

							callback({success: false, message: ["An error has occurred. This has been reported. Thanks!"]});
						}
					});
				}
			});
		}
	});
};

$.EBSearch = function(query, last, limit, fields, sort, index, type, filter, callback) {

	var body = {};
	
	body.filter = filter;

	body.query = {
		"multi_match" : {  
        		"fields" : fields,
   			"query" : query.toLowerCase(),
			"fuzziness" : "AUTO"
		}
	};

	if(last != null && last != "") {

		body.filter = {
			"bool" : {
				"must" : [
					{"range" : { "key" : { "lt" : last }}}
				]
			}
		};
	}

	if(limit == null || limit == "") {
		limit = 0;
	}

	//Check if submitted limit is within specified bounds
        if(limit < 1 || limit > $.defaultLimit) {
		limit = $.defaultLimit;
        } 

	db.client.search({
		index: index,
		type: type,
		sort: sort,
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
