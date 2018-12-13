ROUTE('/', function() {
	SET('common.page', 'dashboard');
});

ROUTE('/users/', function() {
	SET('common.page', 'users');
});

ROUTE('/settings/', function() {
	SET('common.page', 'settings');
});

ROUTE('/notifications/', function() {
	SET('common.page', 'notifications');
});

ROUTE('/users/create/', function() {
	SET('common.page', 'create-user');
});
