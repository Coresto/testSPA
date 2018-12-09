AUTH(function(req, res, flags, next) {
	var cookie = req.cookie(F.config.cookie);
	console.log('Cookie: ' + cookie);
	if (!cookie || cookie.length < 30)
		return next(false);

	var obj = F.decrypt(cookie, 'user');
	console.log('Authkey: ' + JSON.stringify(obj));
	if (!obj)
		return next(false);

	var session = MAIN.sessions[obj.id];
	console.log('Session: ' + JSON.stringify(session));
	if (session) {
		if (session.role) {
			flags.push('@' + session.role);
		}
		// Extends session
		session.expire = NOW.add('20 minutes');
		return next(true, session);
	}
	NOSQL('users').find().make(function(builder) {
		builder.first();
		builder.where('id', obj.id);
		builder.callback(function(err, response) {
			console.log('response --> ' + response.id);
			if (!response)
				return next(false);
			F.cache.add('user_' + response.id, response, '20 minutes');
			MAIN.sessions[response.id] = response;
			flags.push('@' + response.role);
			next(true, response);
		});
	});
});

// Clears expired sessions
ON('service', function(counter) {
	if (counter % 20 !== 0)
		return;
	var keys = Object.keys(MAIN.sessions);
	for (var i = 0; i < keys.length; i++) {
		var id = keys[i];
		if (MAIN.sessions[id].expire < NOW) {
			console.log('Session deleted.');
			delete MAIN.sessions[id];
		}
	}
});
