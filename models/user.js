var debug = require('debug')('microblog');
var assert = require('assert');

function User(user) {
	this.name = user.name;
	this.password = user.password;
}

module.exports = User;

// 保存用户对象
User.prototype.save = function(callback) {
	var user = {
		name: this.name,
		password: this.password
	};

	var collection = global.db.collection('user');
    // Insert a user
    collection.insert(user, function(err, result) {
        assert.equal(err, null);
        debug("saved a user.");
        callback(err, result);
    });
}

// 检验用户名是否存在
User.get = function(username, callback) {
	global.db.collection('user').findOne({name: username}, function(err, result) {
		if (result) {
			var user = new User(result);
			callback(err, user);
		} else {
			callback(err, null);
		}

	});
}

// 用户登录
User.prototype.login = function(callback) {
	global.db.collection('user').findOne({name: this.name, password: this.password}, function(err, result) {
		if (result) {
			var user = new User(result);
			callback(err, user);
		} else {
			callback(err, null);
		}
	});
}