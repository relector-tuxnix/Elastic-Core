
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

		if(fs.existsSync(filename)) {
		    tmp = fs.readFileSync(filename).toString(ENCODING);
		}

		return tmp;
	};
});

setTimeout(function() {
	F.eval(definition);
}, 100);
