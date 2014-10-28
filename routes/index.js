var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { layout: 'layout', title: 'Express' });
});

router.get('/hello', function(req, res) {
	res.render('hello', { title: 'Hello', layout: 'layout'});
});

router.get('/get', function(req, res) {
	res.send('get of index');
});

module.exports = router;
