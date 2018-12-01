AUTH(function(req, res, flags, next) {
	var cookie = req.cookie(F.config.cookie);
	console.log('Cookie: ' + cookie);
	if (!cookie || cookie.length < 30)
		return next(false);

	var obj = F.decrypt(cookie, 'user');
	console.log('Authkey: ' + obj);
	if (!obj)
		return next(false);

	var session = MAIN.sessions[obj.id];
	console.log('Session: ' + session);
	if (session) {
		// Extends session
		session.expire = NOW.add('10 minutes');
		return next(true, session);
	}
	NOSQL('users').find().make(function(builder) {
		builder.first();
		builder.where('id', obj.id);
		builder.callback(function(err, response) {
			console.log('response --> ' + response.id);
			if (!response)
				return next(false);
			F.cache.add('user_' + response.id, response, '10 minutes');
			MAIN.sessions[response.id] = response;
			next(true, response);
		});
	});
});

// Clears expired sessions
ON('service', function(counter) {
	if (counter % 10 !== 0)
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
