NEWSCHEMA('Users').make(function(schema) {
	schema.define('id', 'Number');
	schema.define('username', 'String(30)', true);
	schema.define('password', 'String(30)', true);
	schema.define('name', 'String(50)');
	schema.define('surname', 'String(50)');
	schema.define('email', 'Email');
	schema.define('role', 'String(50)');

	schema.addWorkflow('login', function($) {
		NOSQL('users').find().make(function(builder) {
			builder.first();
			builder.where('username', $.model.username);
			builder.where('password', $.model.password);
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

	schema.addWorkflow('update_user', function($) {
		NOSQL('users').modify($.model).make(function(builder) {
			builder.where('id', $.model.id);
			builder.callback(function(err, count) {
				if (!err && count !== 1) {
					$.invalid('error-user-403');
					return;
				}
				$.success();
    		});
		});
	});

	schema.addWorkflow('create_user', function($) {
		var database = NOSQL('users'), newId = 0;
		database.find().make(function(builder) {
			builder.callback(function (err, response) {
				if (!err) {
					$.invalid('error-user-500', 'Database error: ' + err);
					return;
				}
				for (var obj of response) {
					if (obj.id > newId) {
						newId = obj.id;
					}
				}
			});
		});
		$.model.id = ++newId;
		database.update($.model, true).make(function(builder) {
			builder.callback(function(err, count) {
				if (!err && count !== 1) {
					$.invalid('error-user-403');
					return;
				}
				$.success();
    		});
		});
	});

	schema.addWorkflow('delete_user', function($) {
		// NOSQL('users').modify($.model).make(function(builder) {
		// 	builder.where('id', $.model.id);
		// 	builder.callback(function(err, count) {
		// 		if (!err && count !== 1) {
		// 			$.invalid('error-user-403');
		// 			return;
		// 		}
		// 		$.success();
    	// 	});
		// });
	});
});
