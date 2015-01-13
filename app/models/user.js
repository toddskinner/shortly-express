var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
//   tablename: 'users',

//   initialize: function(){}

});

module.exports = User;
