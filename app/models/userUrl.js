var db = require('../config');
var Link = require('./link.js');
var User = require('.user.js');

var UserUrl = db.Model.extend({
  tableName: 'userUrls',
  user: function() {
    return this.belongsTo(User, 'user_id')
  },
  link: function() {
    return this.belongsTo(Link, 'link_id');
  }
});

module.exports = UserUrl;
