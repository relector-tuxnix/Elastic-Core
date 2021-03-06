var fs = require('fs');
var hb = require('handlebars');
var path = require('path');
var hbs = require('handlebars-form-helpers');
var val = require("validate.js");
var cuid = require('cuid');

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
 
	$.defaultLimit = CONF['default-item-limit'];

	$.defaultTheme = CONF['default_theme'];

	console.log("LOADING ELASTIC-CORE!");

	/* Have to hard code the path as core does not do themes and there can only be one configuration */
	var pages = require('./elastic-core-pages.js');

	$.registerPages(pages);

	/* We don't want to process routes as they are processed by the child site */
	$.processRoutes();

	$.ECSetupAuthentication();
});


$.ECSetupAuthentication = function() { 

	var auth = MODULE('auth');

	auth.onAuthorize = function(user, callback) {

		var query = `
			SELECT
				Store._id,
				Store._creationDate,
				json_extract([value], '$.email') as email,
				json_extract([value], '$.passwordHash') as passwordHash,
				json_extract([value], '$.lockoutEnd') as lockoutEnd,
				json_extract([value], '$.lockoutEnabled') as lockoutEnabled,
				json_extract([value], '$.accessFailedCount') as accessFailedCount
			FROM
				Store, json_each(Store.[_data])
			WHERE
				Store.[_type] = 'user' 
			AND 
				json_extract([value], '$.email') = ?
			LIMIT 1
		`;

		$.ECQuery(query, [user.id], function(result) {

			if(result.message.length > 0) {

				var storedUser = result.message.pop();

				auth.comparePassword(user.password, storedUser.passwordHash, function(err, isMatch) {
					
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

		if("length" in page == false) {
			page.length = undefined;
		}

		if("priority" in page == false) {
			page.priority = 0;
		}

		if("active" in page == false) {
			page.active = true;
		}

		var newRoute = { 
			"url" : page.uri, 
			"controller" : page.controller,
			"flags" : page.flags, 
			"length" : page.length, 
			"priority" : page.priority,
			"active" : page.active
		};

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

			F.route(route.url, controller, route.flags, route.length);
		}	
	}
};


/*
 * Lookup the locale keyword and return it.
 */
$.locale = function(keyword) {

	if($.locales == null) {

		var filename = utils.combine(CONF['directory-locale'], $.defaultTheme);

		filename = path.join(filename, CONF['default-language']);

		filename = `${filename}.json`;

		if(fs.existsSync(filename) == true) {

			console.log(`Found locale: ${filename}`);

			var tmp = fs.readFileSync(filename, 'utf-8');

			$.locales = JSON.parse(tmp);

		} else {

			$.locales = {};
		} 
	}

	return $.locales[keyword] || ''; 
}


$.make = function(self, page) {

	console.log("Making page...");

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

		/* Last view is our final view */
		if(i == $.model.page.views.length - 1) {

			out = template($.model);

		} else {

			$.model[modelKey] = template($.model);
		}
	}

	return out;
};


$.ECExecute = function(sql, params, callback) {

	console.log(`DOING EXECUTE: '${sql}' WITH PARAMATERS '${params}' `);

	db.conn.run(sql, params, function(err) {

		if(err == null) {

			callback({success: true, error: false, message: ["Execution successful."]}); 

		} else {

			console.log(err);

			callback({success: false, error: true, message: ["An error has occurred."]});
		}
	});
};


/*
 * Expects query that returns a column _data with valid JSON content.
 */
$.ECQueryJSON = function(sql, params, callback) {

	console.log(`DOING QUERY: '${sql}' WITH PARAMATERS '${params}'`);

	db.conn.all(sql, params, (err, response) => {

		if(err == null) {

			for(var i = 0, lenI = response.length; i < lenI; i++) {

				var entry = response[i];

				for(var key in entry) {

					try {

						entry[key] = JSON.parse(entry[key]);

					} catch(e) {

						//console.log(`Failed to parse data from store: ${e}`);
					}
				}
			}

			callback({success: true, error: false, message: response});

		} else {

			console.log(err);

			callback({success: false, error: true, message: ["An error has occurred."]});
		}
	});
};


$.ECQuery = function(sql, params, callback) {

	console.log(`DOING QUERY: '${sql}' WITH PARAMATERS '${params}'`);

	db.conn.all(sql, params, (err, response) => {

		if(err == null) {

			callback({success: true, error: false, message: response});

		} else {

			console.log(err);

			callback({success: false, error: true, message: ["An error has occurred."]});
		}
	});
};


/*
 * Need to ensure SQL injection is prevented.
 * Need to implement columns.
 */
$.ECGet = function(table, columns, where, range, order, limit, callback) {

	var allColumns = columns.join(', ');

	var conditions = [];

	if(Array.isArray(range) && range.length == 3) {

		var todayDate = new Date();
		var today = helper.yyyymmdd(todayDate);
		var weekRange = helper.weekRange(todayDate);		
		var weekStart = weekRange.start;
		var weekEnd = weekRange.end;
		var monthRange = helper.monthRange(todayDate);		
		var monthStart = monthRange.start;
		var monthEnd = monthRange.end;

		var column = range[0];
		var from = range[1];
		var to = range[2];

		if(from == "today" || to == "today") {

			from = `${today.yyyy}-${today.mm}-${today.dd} 00:00:00.0000`;
			to = `${today.yyyy}-${today.mm}-${today.dd} 23:59:59.9999`;

			conditions.push(`${column} >= "${from}" AND ${column} <= "${to}"`);

		} else if(from == "week" || to == "week") {

			from = `${weekStart.yyyy}-${weekStart.mm}-${weekStart.dd} 00:00:00.0000`;
			to = `${weekEnd.yyyy}-${weekEnd.mm}-${weekEnd.dd} 23:59:59.9999`;

			conditions.push(`${column} >= "${from}" AND ${column} <= "${to}"`);

		} else if(from == "month" || to == "month") {

			from = `${monthStart.yyyy}-${monthStart.mm}-${monthStart.dd} 00:00:00.0000`;
			to = `${monthEnd.yyyy}-${monthEnd.mm}-${monthEnd.dd} 23:59:59.9999`;

			conditions.push(`${column} >= "${from}" AND ${column} < "${to}"`);

		} else {

			conditions.push(`${column} >= "${from}" AND ${column} <= "${to}"`);
		}
	}

	if(Array.isArray(where) && where.length != 0) {

		for(var i = 0; i < where.length; i++) {

			conditions.push(where[i]);
		}
	}

	var allConditions = `WHERE ${conditions.join(' AND ')}`;

	if(Array.isArray(order) && order.length == 2) {

		var column = order[0];	
		var direction = order[1];

		allConditions += ` ORDER BY ${column} ${direction}`
	}

	$.ECQuery(`SELECT ${allColumns} FROM ${table} ${allConditions} LIMIT ${limit}`, [], callback);
};


$.ECDelete = function(table, key, value, callback) {

	var sql = `DELETE FROM ${table} WHERE ${key} = ?`;

	var constraints = {
		"table": {
			inclusion: [],
			message: "^Not supported: %{value}"
		}
	};

	var failed = $.validate({"table": table}, constraints, {format: "flat"});

	if(failed == undefined) {

		$.ECExecute(sql, [value], function(results) {

			callback(results);
		});

	} else {

		callback({success: false, error: true, message: failed});
	}
};


$.ECSearch = function(keywords, limit, callback) {

	callback({success: false, error: true, message: ["An error has occurred."]});
};


$.ECLogin = function(self, id, password, callback) {

	var auth = MODULE('auth');

	id = id.toString().toUpperCase();

	auth.login(self, {id: id, password: password}, function(result) {

		if(result == false) {

			callback({success: false, message: ["Login failed."]});

		} else {

			callback({success: true, message: ["Login success."]});
		}
	});
};


$.ECLogout = function(self) {

	var auth = MODULE('auth');

	auth.logoff(self, self.user.email);
};


$.ECRegister = function(self, email, password, passwordConfirm, callback) {

	var auth = MODULE('auth');

	var email = self.body.email.toUpperCase();
	var password = self.body.password;
	var passwordConfirm = self.body.passwordConfirm;

	var constraints = {
		email : {
			presence: true,
	  		email: true,
		},
		password : {
			presence: true,
	  		length: {
				minimum: 5
	  		}
	  	},
	  	passwordConfirm : {
			presence: true,
			equality: {
				attribute: "password",
				message: "^The passwords do not match!"
			}
		}
	};

	var failed = $.validate({
		email : email, 
		password : password,
		passwordConfirm : passwordConfirm
	}, constraints, {format: "flat"});

	if(failed == undefined) {

		email = email.toString().toUpperCase();

		$.ECQuery("SELECT * FROM User WHERE email = ? LIMIT 1", [email], function(result) {

			if(result.success == true) {

				callback({success: false, error: false, message: ["Username already exists."]});

			} else {

				auth.cryptPassword(password, function(err, hash) {

					if(err != null) {

						console.log(err);

						callback({success: false, error: true, message: ["An error has occurred."]});
			
					} else {

						var sql = 'INSERT INTO User (id, email, emailConfirmed, passwordHash, lockoutEnd, lockoutEnabled, accessFailedCount, creationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'; 
						
						$.ECExecute(sql, [cuid(), email, 1, hash, '', 0, 0, helper.dateNow()], function(result) {

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

	} else {

		self.json({success: false, error: true, message: failed});
	}
};

