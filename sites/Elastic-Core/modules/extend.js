
var definition = (function() {

	/*
		Response html
		@contentBody {String}
		@headers {Object} :: optional
		return {Controller};
	*/
	Controller.prototype.html = function(contentBody, headers) {

		var self = this;

		return this.content(contentBody, "text/html", headers);
	};

	/*
		Response view
		@name {String}
		return {String}; string is returned
	*/
	Controller.prototype.view = function(name) {
		var self = this;

		var filename = utils.combine(self.config['directory-views'], name);

		var tmp = '';

		if(fs.existsSync(filename))
		    tmp = fs.readFileSync(filename).toString(ENCODING);

		return tmp;
	};

	/*
		Response with file stream that uses the Range and Accept-Range headers
		See: https://gist.github.com/paolorossi/1993068
		@filePath {String}
		return HTTP data stream
	*/
	Controller.prototype.streamFile = function(filePath, fileType) {

		var self = this;

 		var stat = fs.statSync(filePath);

		var total = stat.size;

		if(self.req.headers['range']) {

			var range = self.req.headers.range;
			var parts = range.replace(/bytes=/, "").split("-");
			var partialstart = parts[0];
			var partialend = parts[1];

			var start = parseInt(partialstart, 10);
			var end = partialend ? parseInt(partialend, 10) : total-1;
			var chunksize = (end-start)+1;

			var file = fs.createReadStream(filePath, {start: start, end: end});

			self.res.writeHead(206, { 
				'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
				'Accept-Ranges': 'bytes', 
				'Content-Length': chunksize, 
				'Content-Type': fileType
			});

			file.pipe(self.res);
	
		} else {

			self.res.writeHead(200, { 'Content-Length': total, 'Content-Type': fileType });

			fs.createReadStream(filePath).pipe(self.res);
		}
	};
});

setTimeout(function() {
	framework.eval(definition);
}, 100);
