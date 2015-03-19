var framework = require('total.js');
var http = require('http');
var db = require('./elastic-core/database.js');

framework.once('load', function() {
    
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

			console.log(exists);

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
});

var options = {};
options.ip = '127.0.0.1';
options.port = parseInt(process.argv[2]);
options.config = { name: 'Bomblah' };
//options.https = { key: fs.readFileSync('keys/agent2-key.pem'), cert: fs.readFileSync('keys/agent2-cert.pem')};

framework.http('debug', options);

console.log('****** Started ******');
console.log('****** http://{0}:{1}/ ******'.format(framework.ip, framework.port));
