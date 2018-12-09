const Fs = require('fs');
NEWOPERATION('get_nav_admin', function($) {

	Fs.readFile(F.path.private('navigationAdmin.json'), function(err, data) {
		console.log('admin');
		$.callback(data.toString('utf8').parseJSON(true));
	});
});

NEWOPERATION('get_nav_user', function($) {

	Fs.readFile(F.path.private('navigation.json'), function(err, data) {
		console.log('user');
		$.callback(data.toString('utf8').parseJSON(true));
	});
});

NEWOPERATION('get_users', function($) {
	NOSQL('users').find().make(function(builder) {
		builder.callback(function(err, response) {
			if (!response) {
				$.invalid('error-user-404');
				return;
			}
			$.callback(response);
		});
	});
});
