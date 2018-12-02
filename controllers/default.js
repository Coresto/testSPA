exports.install = function() {
	ROUTE('*', 'index', ['authorize']);
	ROUTE('*', login, ['unauthorize']);
	ROUTE('/login', json_login, ['post', '*User']);
	ROUTE('/login', 'login', ['unauthorize']);
	ROUTE('/logout/', redirect_logout, ['GET', 'authorize']);
	ROUTE('/logout/', redirect, ['unauthorize']);
	// File routes
	FILE('/manifest.json', manifest);
};

function manifest(req, res) {
	res.content(200, '{"name":"{0}","short_name":"{0}","icons":[{"src":"/img/icon.png","sizes":"500x500","type":"image/png"}],"start_url":"/","display":"standalone"}'.format(CONF.name), U.getContentType('json'));
}

function login() {
	var self = this;
	console.log('method login');
	self.redirect('/login');
}

function json_login() {
	var self = this;
	console.log('workflow');
	self.$workflow('login', self, self.callback());
}

function redirect() {
	var self = this;
	console.log('redirect');
	self.redirect('/');
}

function redirect_logout() {
	var self = this;
	var session = MAIN.sessions[self.user.id];
	var keys = Object.keys(MAIN.sessions);
	for (var i = 0; i < keys.length; i++) {
		if (MAIN.sessions[keys[i]] === session) {
			console.log('Session deleted.');
			delete MAIN.sessions[keys[i]];
		}
	}
	self.cookie(F.config.cookie, '', '-1 day');
	self.redirect('/');
}
