var $ = exports;

$.error = {
	uri: '/error',
	label: 'Error Occured',
	views: [
		{'default' : 'elastic-core/error'}
	],
	options: [],
	above: [],
	below: []
};

$.error401 = {
	uri: '#401',
	label: 'Unauthorized'
};

$.error403 = {
	uri: '#403',
	label: 'Forbidden'
};

$.error404 = {
	uri: '#404',
	label: 'Not Found'
};

$.error408 = {
	uri: '#408',
	label: 'Request Timeout'
};

$.error431 = {
	uri: '#431',
	label: 'Request Header Fields Too Large'
}

$.error500 = {
	uri: '#500',
	label: 'Internal Server Error'
};

$.apiLogin = {
	uri: '/api/login',
	options: ['post', 'unauthorize'],
	label: 'API Login'
};

$.apiLogout = {
	uri: '/api/logout',
	options: ['get', 'authorize'],
	label: 'API Logout'
};

$.apiRegister = {
	uri: '/api/register',
	options: ['post', 'unauthorize'],
	label: 'API Register',
	active: true
};

$.apiSearch = {
	uri: '/api/search',
	options: ['post'],
	label: 'Search.'
};

$.apiSetLanguage = {
	uri: '/api/setlanguage',
	options: ['post'],
	label: 'Set Language',
}

$.home = {
	uri: '/',
	label: 'Elastic Core Example Home Page',
	views: [
		{'default' : 'elastic-core/home.html'}
	],
	options: [],
	above: [],
	below: []
};

$.login = {
	uri: '/login',
	options: ['unauthorize', 'get'],
	postOptions: ['unauthorize', 'post'],
	label: 'Elastic Core Example Login Page',
	views: [
		{'default' : 'elastic-core/login.html'}
	],
	above: [],
	below: []
};

$.logout = {
	uri: '/logout',
	options: ['authorize'],
	label: 'Elastic Core Example Logout',
	above: [],
	below: []
};

$.register = {
	uri: '/register',
	options: ['unauthorize'],
	postOptions: ['unauthorize', 'post'],
	label: 'Register',
	views: [
		{'default' : 'elastic-core/register.html'}
	],
	active: true,
	above: [],
	below: []
};
