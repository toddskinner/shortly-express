var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');


var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'ssshhhhh', resave: false, saveUninitialized: false}));
// app.use(bcrypt.compare);

// REFACTOR
// app.get('/',
// function(req, res) {
//   util.checkUser(req, res, function() {
//     res.render('index');
//   });
// });

app.get('/', util.checkUser, function(req, res) {
  res.render('index');
});

app.get('/create', util.checkUser, function(req, res) {
  res.render('index');
});

app.get('/links', util.checkUser, function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
    // res.redirect('index');
  });
});

app.post('/links',
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save().then(function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/


app.get('/login',
function(req, res) {
  // req.session.destroy();
  res.render('login');
});

app.post('/login',
function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username }).fetch().then(function(userFound) {
    if(userFound) {
      bcrypt.hash(password, userFound.attributes.salt, null, function(err, newHash){
        if (newHash === userFound.attributes.password) {
          req.session.regenerate(function(){
            req.session.user = username;
            res.redirect('/matt');
          });
        } else {
          // if username exists in db, but wrong password... send message "incorrect password"
          res.redirect('/login');
        }
      });

    // if username does not exist, send to signup page
    } else {
      res.redirect('/signup');
    }

      // brcrypt.compare(password, userFound.attributes.password, function(err, match) {
    //     if (match) {

  });
});


app.get('/signup',
function(req, res) {
  res.render('signup');
});

app.post('/signup',
function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username }).fetch().then(function(found) {
  // check whether username exists or not
    if (found) {
    // if username exists,
      // notify client that it's taken and ask for a new username
      console.log('Username already exists');
      res.redirect('/signup');
    } else {
    // if username !exist,  -- SELECT username FROM users WHERE username = username;
      // res.send(201)
      // enter username and password into db.collection / users collection
      var user = new User({
        username: username,
        password: password,
      });

      user.save().then(function(newUser) {
        Users.add(newUser);
        res.redirect('/index');
      });

    }
  });
});

app.get('/logout', function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

app.post('/logout', function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        db.knex('urls')
          .where('code', '=', link.get('code'))
          .update({
            visits: link.get('visits') + 1,
          }).then(function() {
            return res.redirect(link.get('url'));
          });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
