var db = require('../config');
var UserUrl = require('../models/userUrl');

var UserUrls = new db.Collection();

UserUrls.model = UserUrl;

module.exports = UserUrls;
