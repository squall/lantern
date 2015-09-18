var Router = require('koa-router');
var Role = require('../../lib/role');

var router = module.exports = new Router();

router.get('/admin/api/roles', function *() {

	var page = parseInt(this.request.query.page) || 1;
	var perPage = parseInt(this.request.query.perpage) || 100;
	var q = {};
	try {
		q = JSON.parse(this.request.query.q);
	} catch(e) {}

	var conditions = {};
	if (q.name) {
		conditions.name = new RegExp(q.name, 'i');
	}

	// Fetching a list with specific condition
	var data = yield Role.list(conditions, [
		'name',
		'desc',
		'created'
	], {
		skip: (page - 1) * perPage,
		limit: perPage
	});

	this.body = {
		page: page,
		perPage: perPage,
		pageCount: Math.ceil(data.count / perPage),
		roles: data.roles
	};
});

router.post('/admin/api/roles', function *() {

	if (!this.request.body.name || !this.request.body.desc || !this.request.body.perms) {
		this.status = 401;
		return;
	}

	try {
		// Create a new role
		var role = yield Role.create({
			name: this.request.body.name,
			desc: this.request.body.desc,
			perms: this.request.body.perms
		});
	} catch(e) {
		console.log(e);
	}

	this.body = {
		role: {
			_id: role._id,
			name: role.name,
			desc: role.desc,
			perms: role.perms
		}
	};
});
