var $ = exports;

$.error = {
	uri: '/error',
	controller: 'elastic-core/default.js',
	label: 'Error Occured',
	views: [
		{'default' : 'elastic-core/error'}
	],
	flags: [],
	above: [],
	below: []
};

$.error401 = {
	uri: '#401',
	controller: 'elastic-core/default.js',
	label: 'Unauthorized'
};

$.error403 = {
	uri: '#403',
	controller: 'elastic-core/default.js',
	label: 'Forbidden'
};

$.error404 = {
	uri: '#404',
	controller: 'elastic-core/default.js',
	label: 'Not Found'
};

$.error408 = {
	uri: '#408',
	controller: 'elastic-core/default.js',
	label: 'Request Timeout'
};

$.error431 = {
	uri: '#431',
	controller: 'elastic-core/default.js',
	label: 'Request Header Fields Too Large'
}

$.error500 = {
	uri: '#500',
	controller: 'elastic-core/default.js',
	label: 'Internal Server Error'
};

$.apiGetById = {
	uri: '/api/get-by-id',
	controller: 'elastic-core/api.js',
	flags: ['post'],
	label: 'API Get By ID'
};

$.apiDeleteById = {
	uri: '/api/delete',
	controller: 'elastic-core/api.js',
	flags: ['post', 'authorize'],
	label: 'API Delete By ID.'
};

$.apiLogin = {
	uri: '/api/login',
	controller: 'elastic-core/api.js',
	flags: ['post', 'unauthorize'],
	label: 'API Login'
};

$.apiLogout = {
	uri: '/api/logout',
	controller: 'elastic-core/api.js',
	flags: ['get', 'authorize'],
	label: 'API Logout'
};

$.apiRegister = {
	uri: '/api/register',
	controller: 'elastic-core/api.js',
	flags: ['post', 'unauthorize'],
	label: 'API Register',
};

$.apiSearch = {
	uri: '/api/search',
	controller: 'elastic-core/api.js',
	flags: ['post'],
	label: 'Search.'
};

$.apiSetLanguage = {
	uri: '/api/setlanguage',
	controller: 'elastic-core/api.js',
	flags: ['post'],
	label: 'Set Language',
}

$.home = {
	uri: '/',
	controller: 'elastic-core/home.js',
	label: 'Elastic Core Example Home Page',
	views: [
		{'default' : 'elastic-core/home.html'}
	],
	flags: ['get'],
	above: [],
	below: []
};

$.getLogin = {
	uri: '/login',
	controller: 'elastic-core/login.js',
	flags: ['unauthorize', 'get'],
	label: 'Elastic Core Example Login Page',
	views: [
		{'default' : 'elastic-core/login.html'}
	],
	above: [],
	below: []
};

$.postLogin = {
	uri: '/login',
	controller: 'elastic-core/login.js',
	flags: ['unauthorize', 'post'],
	label: 'Elastic Core Example Login Page',
	views: [
		{'default' : 'elastic-core/login.html'}
	],
	above: [],
	below: []
};

$.logout = {
	uri: '/logout',
	controller: 'elastic-core/login.js',
	flags: ['authorize'],
	label: 'Elastic Core Example Logout',
	above: [],
	below: []
};

$.getRegister = {
	uri: '/register',
	controller: 'elastic-core/register.js',
	flags: ['unauthorize'],
	postFlags: ['unauthorize', 'post'],
	label: 'Register',
	views: [
		{'default' : 'elastic-core/register.html'}
	],
	above: [],
	below: []
};

$.postRegister = {
	uri: '/register',
	controller: 'elastic-core/register.js',
	flags: ['unauthorize', 'post'],
	label: 'Register',
	views: [],
	above: [],
	below: []
};
