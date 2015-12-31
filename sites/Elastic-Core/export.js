var common = require('./elastic-core/common.js');

common.EBGetMany('posts', 'post', {}, 0, function(results) {
	
	console.log(results);
});
