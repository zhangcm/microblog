/**
 * 微博数据模型
 */
var debug = require('debug')('microblog');
var assert = require('assert');

function Post(username, post, time) {
	this.user = username;
	this.post = post;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
}

module.exports = Post;

Post.prototype.save = function(callback) {
	var post = {
		user: this.user,
		post: this.post,
		time: this.time
	};
	global.db.collection('posts').insert(post, function(err, result) {
		if (err) {
			return callback(err, null);
		}
		callback(err, result);
	});
}

Post.get = function(username, callback) {
	var query = {};
	if (username) {
		query.user = username;
	}
	db.collection('posts').find(query).toArray(function(err, docs) {
		if (err) {
			return callback(err, null);
		}
		var posts = [];
		docs.forEach(function(doc, index){
			var post = new Post(doc.user, doc.post, doc.time);
			posts.push(post);
		});
		callback(null, posts);
	});
}