var fs = require('fs')

var common = require('./elastic-core/common.js');

if(process.argv.length == 6) {

	var file = process.argv[2];
	var index = process.argv[3];
	var type = process.argv[4];
	var id = process.argv[5];

	fs.readFile(file, 'utf8', function(err, data) {
	
		if(err) {
			return console.log(err);
		}

		try {
			var json = JSON.parse(data);

			for(var i = 0, len = json.length; i < len; i++) {

				var data = json[i];

				common.EBIndex(data[id], data, index, type, function(results) {

					console.log(results);
				});
			}

		} catch (err2) {

			console.log(err2);
		}
	});

} else {
	console.log("You need to supply: <output-file-name> <index-name> <index-type> <_id-key>");	
}




