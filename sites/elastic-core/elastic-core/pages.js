
exports.error = {
	uri: '/error',
	label: 'Error Occured',
	view: 'elastic-core/error',
	above: [],
	below: []
};

exports.error401 = {
	uri: '#401',
	label: 'Unauthorized',
};

exports.error403 = {
	uri: '#403',
	label: 'Forbidden',
};

exports.error404 = {
	uri: '#404',
	label: 'Not Found',
};

exports.error408 = {
	uri: '#408',
	label: 'Request Timeout',
};

exports.error431 = {
	uri: '#431',
	label: 'Request Header Fields Too Large',
}

exports.error500 = {
	uri: '#500',
	label: 'Internal Server Error',
};

exports.apiLogin = {
	uri: '/api/login',
	label: 'API Login',
};

exports.apiLogout = {
	uri: '/api/logout',
	label: 'API Logout',
};

exports.apiRegister = {
	uri: '/api/register',
	label: 'API Register',
};

module.exports.apiSearch = {
	uri: '/api/search',
	label: 'Search.',
};

exports.default = {
	uri: '/',
	label: 'Elastic Core',
	view: 'elastic-core/default',
	above: [],
	below: []
};

exports.home = {
	uri: '/',
	label: 'Elastic Core Example Home Page',
	view: 'elastic-core/home',
	above: [],
	below: []
};
