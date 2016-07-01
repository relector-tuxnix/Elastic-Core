var fs = require('fs');
var cuid = require('cuid');


var common = require('./elastic-core/common.js');

	fs.readFile('posts.out', 'utf8', function(err, data) {
	
		if(err) {
			return console.log(err);
		}

		try {
			var json = JSON.parse(data);

			var dos = [];

			for(var i = 0, len = json.length; i < len; i++) {

				//var data = json[i]._source;
				var data = json[i];

				var updated = new Date().format('yyyy/MM/dd');

				var article = {'key' : cuid(), 'id' : data.uri, 'content' : data.content, 'user' : data.user, 'live' : data.live, 'group' : 'article', 'created' : data.uri.substring(0, 10).replace(new RegExp('-', 'g'), "/")};

				article.updated = updated;

				dos.push(article);

				var summary = {'key' : cuid(), 'id' : data.uri + "-Summary", 'content' : data.summary, 'user' : data.user, 'live' : data.live, 'group' : 'summary', 'created' : data.uri.substring(0,10).replace(new RegExp('-', 'g'),"/")};

				summary.updated = updated;

				dos.push(summary);
			}

			var str = JSON.stringify(dos);

			fs.writeFile('elastic-blog-posts-new.json', str, function(err) {

				if(err) {
					return console.log(err);
				}

				console.log("The file was saved!");
			}); 


		} catch (err2) {

			console.log(err2);
		}
	});
