var $ = exports;

$.error = {
	uri: '/error',
	label: 'Error Occured',
	view: 'elastic-core/error',
	above: [],
	below: []
};

$.error401 = {
	uri: '#401',
	label: 'Unauthorized',
};

$.error403 = {
	uri: '#403',
	label: 'Forbidden',
};

$.error404 = {
	uri: '#404',
	label: 'Not Found',
};

$.error408 = {
	uri: '#408',
	label: 'Request Timeout',
};

$.error431 = {
	uri: '#431',
	label: 'Request Header Fields Too Large',
}

$.error500 = {
	uri: '#500',
	label: 'Internal Server Error',
};

$.apiLogin = {
	uri: '/api/login',
	label: 'API Login',
};

$.apiLogout = {
	uri: '/api/logout',
	label: 'API Logout',
};

$.apiRegister = {
	uri: '/api/register',
	label: 'API Register',
};

$.apiSearch = {
	uri: '/api/search',
	label: 'Search.',
};

$.default = {
	uri: '/',
	label: 'Elastic Core',
	view: 'elastic-core/default',
	above: [],
	below: []
};

$.home = {
	uri: '/',
	label: 'Elastic Core Example Home Page',
	view: 'elastic-core/home',
	above: [],
	below: []
};

$.login = {
	uri: '/login',
	label: 'Elastic Core Example Login Page',
	view: 'elastic-core/login',
	above: [],
	below: []
};

$.logout = {
	uri: '/logout',
	label: 'Elastic Core Example Logout',
	above: [],
	below: []
};

