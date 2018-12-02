NEWSCHEMA('User').make(function(schema) {

	schema.define('username', 'String(30)', true);
	schema.define('password', 'String(30)', true);

	schema.addWorkflow('login', function(error, model, controller, callback) {
		NOSQL('users').find().make(function(builder) {
			console.log('username:' + model.username);
 			console.log('password:' + model.password);
			builder.first();
			builder.where('username', model.username);
			builder.where('password', model.password);
			builder.callback(function(err, response) {

				if (!response) {
					console.log('error-user-404');
					error.push('error-user-404');
					return callback(false);
				}
				// Writes logs
				NOSQL('users-logs').insert({ id: response.id, username: response.username, email: response.email, date: new Date().format('dd.MM.yyyy HH:mm:ss') });

				// Sets cookies
				controller.cookie(F.config.cookie, F.encrypt({ id: response.id, ip: controller.ip }, 'user'), '5 minutes');
				callback(SUCCESS(true));

			}, error);
		});
	});
	
});
