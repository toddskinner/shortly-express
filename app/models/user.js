var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',

  initialize: function(){
    this.on('created', function(model, attrs, options){

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(model.get('password'), salt, null, function(err, hash){
          model.set('password', hash);
          console.log(hash);
          model.set('salt', salt);
          model.save();
        });
      });
    });
  },

  // compare: function(submitted, hash, function(err, res) {}) {
  // }

  //     var shasum = crypto.createHash('sha1');
  //     shasum.update(model.get('url'));
  //     model.set('code', shasum.digest('hex').slice(0, 5));
  //   });
  // }
});

module.exports = User;
