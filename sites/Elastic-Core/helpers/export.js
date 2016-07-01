var fs = require('fs');

var common = require('./elastic-core/common.js');

if(process.argv.length == 5) {

	var file = process.argv[2];
	var index = process.argv[3];
	var type = process.argv[4];

	common.EBGetMany(index, type, {}, 0, "", function(results) {
		
		console.log(results);

		if(results.success == true) {

			try {
				var str = JSON.stringify(results.message);

				fs.writeFile(file, str, function(err) {

					if(err) {
						return console.log(err);
					}

					console.log("The file was saved!");
				}); 

			} catch (err) {

				console.log("Could not convert results in to JSON string!");
			}

		} else {
			console.log("Failed to get results!");
		}
	});

} else {
	console.log("You need to supply: <output-file-name> <index-name> <index-type>");	
}


