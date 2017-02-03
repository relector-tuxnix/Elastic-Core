var sass = require('node-sass');
var postcss = require('postcss');
var fs = require('fs');

exports.install = function() {

	F.accept('scss', 'text/css');

	F.file(function(req, res, isValidation) {

		if(isValidation) {
			return req.extension === 'scss';
		}

		F.exists(req, res, 20, function(next, tmp) {

			var filename = F.path.public(req.url);

			fs.readFile(filename, function(err, data) {

				if(err) {
					next();
					res.throw404();
					return;
				}

				var content = F.onCompileStyle(filename, data.toString('utf8'));

				F.responseContent(req, res, 200, content, 'text/css', true);
			});
		});
	});

	F.onCompileStyle = function(filename, content) {

		var compiledSass = sass.renderSync({ file: filename, data: content, outputStyle: 'compressed' }).css.toString('utf8');

		var css = postcss([
			require('postcss-input-range'),
			require('postcss-lh'),
			require('postcss-custom-media'),
			require('postcss-media-minmax'),
			require('autoprefixer')
		]).process(compiledSass).css;

		return css;
	};
};
