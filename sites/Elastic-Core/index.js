var F = require('total.js');
var http = require('http');
var common = require('./elastic-core/common.js');
var db = require('./elastic-core/database.js');
var pages = require('./elastic-core/pages.js');

F.once('load', function() {
    
	var self = this;

	var auth = self.module('authorization');

	auth.onAuthorization = function(user, callback) {

		db.client.search({
			index: 'users',
			size: 1,
			body: {
				query: {
					"filtered" : {
						"filter" : {
							"term" : {
								"id" : user.id
							}
						}
					}
				}
			}
		}, function (error, exists) {

			if(exists.hits.total == 1) {

				var storedUser = exists.hits.hits.pop()._source;

				console.log(storedUser);

				auth.comparePassword(user.password, storedUser.password, function(err, isMatch) {
					
					if(isMatch) {

						callback(storedUser);

					} else {
						
						callback(null);
					}
				});

			} else {
				callback(error);
			}
		});
	};

	common.registerPages(pages);

	common.processRoutes();	

	console.log("LOADED!")
});

F.http('debug');

console.log('****** Started ******');
