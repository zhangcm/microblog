var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var Post = require('../models/post');
var debug = require('debug')('microblog');

/* GET home page. */
router.get('/', function(req, res) {
  Post.get(null, function(err, posts) {
  	if (err) {
  		posts = [];
  	}
  	debug('index post:' + posts.length);
  	res.render('index', { layout: 'layout', 'posts': posts});
  });
});

// get请求，显示注册页面
router.get('/reg', function(req, res) {
	res.render('reg', {layout: 'layout'});
});
// post请求，用户注册
router.post('/reg', function(req, res) {
	// 检验用户两次输入的口令是否一致，使用req.body获取表单值
	if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error', '两次输入的口令不一致');
		return res.redirect('/reg');
	}
	// 生成口令的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var user = new User({
		name: req.body.username,
		password: password
	});

	User.get(user.name, function(err, aUser) {
		if (aUser) {
			err = 'Username already exists.';
			debug('Username already exists.');
		}
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		// 如果不存在，则新增用户
		user.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = user;
			req.flash('success', '注册成功');
			return res.redirect('/login');
		});
	});
});

router.get('/login', function(req, res) {
	res.render('login', { layout: 'layout'});
});

router.post('/login', function(req, res) {
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var user = new User({
		name: req.body.username,
		password: password
	});

	user.login(function(err, aUser) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/login');
		}
		if (!aUser) {
			req.flash('error', '用户名或密码不正确');
			return res.redirect('/login');
		}
		req.session.user = aUser;
		return res.redirect('/');
	});
});

router.get('/logout', function(req, res) {
	req.session.user = null;
	return res.redirect('/');
});

router.post('/post', checkLogin);

router.post('/post', function(req, res) {
	var currentUser = req.session.user;
	var post = new Post(currentUser.name, req.body.post);
	post.save(function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发表成功');
		res.redirect('/user/' + currentUser.name);
	});
});

function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '您还未登录');
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', '已登录');
		return res.redirect('/');
	}
	next();
}

module.exports = router;
