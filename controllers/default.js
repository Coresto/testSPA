exports.install = function() {
	GROUP(['unauthorize'], function() {
		ROUTE('/*', 'login');
		ROUTE('POST   /login/           *Users --> @login');
	});

	GROUP(['authorize'], function() {
		ROUTE('/*', 'index');
		ROUTE('/logout/', redirect_logout);

	});
	GROUP(['authorize', '@admin'], function() {
		ROUTE('GET 		/api/navigator/				 	* --> @get_nav_admin');
		ROUTE('GET		/api/users/						* --> @get_users');
		ROUTE('PUT		/api/users/						*Users --> @update_user');
	});
	GROUP(['authorize', '@user'], function() {
		ROUTE('GET 		/api/navigator/ 				* --> @get_nav_user');
	});
	// File routes
	FILE('/manifest.json', manifest);
};

function manifest(req, res) {
	res.content(200, '{"name":"{0}","short_name":"{0}","icons":[{"src":"/img/icon.png","sizes":"500x500","type":"image/png"}],"start_url":"/","display":"standalone"}'.format(CONF.name), U.getContentType('json'));
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
