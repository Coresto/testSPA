NEWSCHEMA('Users').make(function(schema) {
	schema.define('username', 'String(30)', true);
	schema.define('password', 'String(30)', true);

	schema.addWorkflow('login', function($) {

		var model = $.model;
		NOSQL('users').find().make(function(builder) {
			builder.first();
			builder.where('username', model.username);
			builder.where('password', model.password);
			builder.callback(function(err, response) {
				if (!response) {
					$.invalid('error-user-404');
					return;
				}
				// Writes logs
				NOSQL('users-logs').insert({ id: response.id, username: response.username, email: response.email, date: new Date().format('dd.MM.yyyy HH:mm:ss') });

				// Sets cookies
				$.controller.cookie(F.config.cookie, F.encrypt({ id: response.id, ip: $.ip }, 'user'), '20 minutes');
				$.success();
			});
		});
	});
});
