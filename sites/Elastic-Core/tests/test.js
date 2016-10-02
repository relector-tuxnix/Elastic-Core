var F = require('total.js');
var common = require('../elastic-core/common.js');

common.defaultLimit = F.config['default-item-limit'];
common.defaultTheme = F.config['default-theme'];


var data = {"_type" : "user", "_id" : "bob7", "_password" : "test"}; 

/* Test store new */
common.ECStore('', data, function(result) {

	console.log("STORE RESULT:");
	console.log(result);

	data = {"_key" : result.key, "_password" : "test2"}; 

	/* Test merge update */
	common.ECStore(data["_key"], data, function(result) {

		console.log("MERGE UPDATE RESULT:");
		console.log(result);

		/* Test get */
		common.ECGet({"_key" : data["_key"]}, 100, [], [], [], [], function(result) {

			console.log("GET RESULT:");
			console.log(result);

			/* Test delete */
			common.ECDelete(data["_key"], function(result) {

				console.log("DELETE RESULT:");
				console.log(result);
			});
		});
	});
});

/*
common.ECSearch('^2016-09', 'users', 'created', '5', function(result) {

	console.log(result);
});
*/
