var F = require('total.js');
var fs = require('fs');
var hb = require('handlebars');
var path = require('path');
var hbs = require('handlebars-form-helpers');
var val = require("validate.js");
var cuid = require('cuid');
var couchbase = require('couchbase')

var helper = require('./helpers.js');
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

	console.log("LOADING ELASTIC-CORE!");

	/* Have to hard code the path as core does not do themes and there can only be one configuration */
	var pages = require('./elastic-core-pages.js');

	$.registerPages(pages);

	/* We don't want to process routes as they are processed by the child site */
	//$.processRoutes();

	$.ECSetupAuthentication();
});


$.ECSetupAuthentication = function() { 

	var auth = MODULE('authorization');

	auth.onAuthorization = function(user, callback) {

		$.ECGet([`_type = "user"`, `_id = "${user.id}"`], 1, [], [], [], function(result) {

			if(result.success == true) {

				var storedUser = result.message.pop();

				auth.comparePassword(user.password, storedUser["_password"], function(err, isMatch) {
					
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
 * Enable priority sorting of routes to allow site inheritance	
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
 * Now we have all the routes let total.js know about them.
 */
$.processRoutes = function() {

	for(var key in $.routes) {

		var route = $.routes[key];

		if(route.active == true) {
	
			/* Lets get the controller now that everything has actually loaded... we don't want circular reference issues! */
			var cont = `require('../controllers/${route.controller}').${key}`;

			controller = eval(cont);

			console.log(`REGISTERED MAPPING: ${key} -> ${route.url} -> ${cont}`);

			F.route(route.url, controller, route.flags, route.length, route.middleware, route.timeout, route.options);
		}	
	}
};

/*
 * Lookup the locale keyword and return it.
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


$.ECStore = function(key, data, callback) {

	var now = new Date().format('yyyy-MM-dd HH:mm:ss.sss');
	var created = false;

	if(key == null || key == '') {

		key = cuid();
		data._created = now; 
		created = true;
	}

	data._updated = now;
	data._key = key;

	/* We want to merge objects not over-ride the existing object */
	$.ECGet([`_key = "${key}"`], 1, [], [], [], function(result) { 

		if(result.error == true) {

			callback(result);

			return;
		}

		if(result.success == true) {

			data = helper.mergeDicts(result.message.pop(), data);
		}

		db.bucket.upsert(key, data, function(err, response) {

			if(err == null) {
				
				callback({success: true, error: false, message: ["Stored."], created: created, key: key});
				
			} else {

				console.log(err);

				callback({success: false, error: true, message: ["An error has occurred."]});
			}
		});
	});
};


$.ECDelete = function(key, callback) {

	db.bucket.remove(key, function(err, response) {

		if(err == null) {

			callback({success: true, error: false, message: ["Deleted"]}); 

		} else {

			console.log(err);

			callback({success: false, error: true, message: ["An error has occurred."]});
		}
	});
};

/*
 * Need to ensure SQL injection is prevented.
 */
$.ECGet = function(data, limit, last, range, order, callback) {

	if(isNaN(limit)) { 

		limit = 0;

	} else if(limit < 1 || limit > $.defaultLimit) {

                limit = $.defaultLimit;
        }

	var conditions = [];

	if(Array.isArray(last) && last.length == 3) {

		var column = last[0];
		var direction = last[1];
		var value = last[2];

		if(direction != ">" && direction != "<") { 

			direction = ">";
		}

		conditions.push(`${column} ${direction} "${value}"`);
	}

	if(Array.isArray(range) && range.length == 3) {

		var column = range[0];
		var from = range[1];
		var to = range[2];

		conditions.push(`${column} >= "${from}" AND ${column} <= "${to}"`);
	}

	if(Array.isArray(data) && data.length != 0) {

		for(var i = 0; i < data.length; i++) {

			conditions.push(data[i]);
		}
	}

	var allConditions = `WHERE ${conditions.join(' AND ')}`;

	if(Array.isArray(order) && order.length == 2) {

		var column = order[0];	
		var direction = order[1];

		allConditions += ` ORDER BY ${column} ${direction}`
	}

	$.ECQuery(`SELECT core.* FROM core ${allConditions} LIMIT ${limit}`, callback);
};


$.ECQuery = function(query, callback) {

	console.log(query);

	var sql = db.query.fromString(query);
	
	/* Get all documents, even un-indexed ones */
	sql.consistency(db.query.Consistency.REQUEST_PLUS);

	db.bucket.query(sql, function(err, response, meta) {

		if(err == null) {

			if(response.length == 0) {

				callback({success: false, error: false, message: []});

			} else {

				callback({success: true, error: false, message: response});
			}

		} else {

			console.log(err);

			callback({success: false, error: true, message: ["An error has occurred."]});
		}
	});
};


$.ECSearch = function(keywords, limit, callback) {

	var searchQuery = db.couchbase.SearchQuery;

	var query = searchQuery.new('post-search-index', searchQuery.term(keywords));

	query.limit(limit);

	db.bucket.query(query, function(err, response, meta) {

		if(err == null) {

			if(response.length == 0) {

				callback({success: false, error: false, message: []});

			} else {

				callback({success: true, error: false, message: response});
			}

		} else {

			console.log(err);

			callback({success: false, error: true, message: ["An error has occurred."]});
		}
	});
};


$.ECLogin = function(self, id, password, callback) {

	var auth = self.module('authorization');

	auth.login(self, {id: id, password: password}, function(result) {

		if(result == false) {

			callback({success: false, message: ["Login failed."]});

		} else {

			callback({success: true, message: ["Login success."]});
		}
	});
};


$.ECLogout = function(self) {

	var auth = self.module('authorization');

	auth.logoff(self, self.user["_id"]);
};


$.ECRegister = function(self, id, password, callback) {

	var auth = self.module('authorization');

	$.ECGet([`_type = "user"`, `_id = "${id}"`], 1, [], [], [], function(result) {

		if(result.success == true) {

			callback({success: false, error: false, message: ["Username already exists."]});

		} else {

			auth.cryptPassword(password, function(err, hash) {

				if(err != null) {

					console.log(err);

					callback({success: false, error: true, message: ["An error has occurred."]});
		
				} else {

					var data = {"_type" : "user", "_id" : id, "_password" : hash};

					$.ECStore('', data, function(result) {

						if(result.success == true) {
							
							callback({success: true, error: false, message: ["User registration successful."]});
							
						} else {

							console.log(err);

							callback({success: false, error: true, message: ["An error has occurred."]});
						}
					});
				}
			});
		}
	});
};
