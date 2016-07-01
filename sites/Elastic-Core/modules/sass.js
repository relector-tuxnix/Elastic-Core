var sass = require('node-sass');
var fs = require('fs');

exports.install = function() {

	framework.file('SCSS', scssCompiler);

	// This is called by total.js->internal.js
	framework.onCompileStyle = function (filename, content) {
		return content;		
	};
};

function scssCompiler(req, res, isValidation) {

	if (isValidation) {
		return req.url.indexOf('.scss') !== -1 || req.url.indexOf('.sass') !== -1;
	}

	var self = this;

	// create temporary filename. we'll compile file
	var filename = self.path.temp(req.url.replace(/\//g, '-').substring(1));

	// Cache for RELEASE MODE ONLY
	if (framework.isProcessed(filename)) {
		self.responseFile(req, res, filename);
		return;
	}

	fs.readFile(self.path.public(req.url), function(err, data) {

		if (err) {
			self.response404(req, res);
			return;
		}

		var css = sass.renderSync({ data: data.toString(), outputStyle: 'compressed' });

		// write compiled content into the temporary file
		fs.writeFileSync(filename, css.css);

		// this function affect framework.isProcessed() function
		self.responseFile(req, res, filename);
	});
}
