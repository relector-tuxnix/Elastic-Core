var sass = require('node-sass');
var fs = require('fs');

exports.install = function() {

	F.accept('scss', 'text/css');

	F.file(function(req, res, isValidation) {

		if(isValidation) {
			return req.extension === 'scss';
		}

		F.exists(req, res, 20, function(next, tmp) {

			var filename = F.path.public(req.url);

			// create temporary filename
			// we'll compile file
			var cachedFilename = F.path.temp(req.url.replace(/\//g, '-').substring(1));

			fs.readFile(filename, function(err, data) {

				if(err) {
					next();
					res.throw404();
					return;
				}

				var content = F.onCompileStyle(filename, data.toString('utf8'));

				// write compiled content into the temporary file
				fs.writeFileSync(cachedFilename, content);

				F.responseFile(req, res, cachedFilename);
			});
		});
	});

	F.onCompileStyle = function(filename, content) {

		var compiledSass = sass.renderSync({ file: filename, data: content, outputStyle: 'compressed' }).css.toString('utf8');

		return css;
	};
};
