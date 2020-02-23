
var definition = (function() {

	var fs = require('fs');

	/*
		Response html
		@contentBody {String}
		@headers {Object} :: optional
		return {Controller};
	*/
	Controller.prototype.html = function(contentBody, headers) {

		var self = this;

		return self.content(contentBody, "text/html", headers);
	};

	/*
		Response view
		@name {String}
		return {String}; string is returned
	*/
	Controller.prototype.view = function(name) {

		var self = this;

		console.log(`Fetching view: ${name}`);

		var filename = utils.combine(CONF['directory-views'], name);

		var tmp = '';

		if(fs.existsSync(filename)) {
		    tmp = fs.readFileSync(filename).toString(ENCODING);
		}

		return tmp;
	};
});

setTimeout(function() {
	F.eval(definition);
}, 100);
