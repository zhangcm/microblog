var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');
var debug = require('debug')('microblog');

/* GET users listing. */
router.get('/:user', function(req, res) {
  User.get(req.params.user, function(err, user) {
  	if (!user) {
  		req.flash('error', '用户不存在');
  		return res.redirect('/');
  	}
  	Post.get(user.name, function(err, posts) {
  		if (err) {
  			req.flash('error', err);
  			return res.redirect('/');
  		}
  		res.render('user', { layout: 'layout', posts: posts});
  	});
  });
});

module.exports = router;
