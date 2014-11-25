var dbName = 'microblog';
var host = 'localhost';
var port = 27017;
var url = 'mongodb://' + host + ':' + port + '/' + dbName;

var settings = {
	'cookie_secret': 'microblogbyvoid',
	'db': dbName,
	'host': host,
	'url': url
};

module.exports = settings;