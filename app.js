var express = require('express');
var exphbs  = require('express-handlebars');
var session = require('express-session');
     bodyParser = require('body-parser');

     
var app = express();

    // create a route
//app.use(myConnection(mysql, dbOptions, 'single'));
app.use(express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

//setup middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var checkUser = function(req, res, next){
  if (req.session.user){
    return next();
  }
  // the user is not logged in redirect him to the login page
  res.redirect('login');
};

app.post('/user', function (req, res) {
  
  if (form.user === 'denver' && form.password === 'password') {
    res.redirect('/home');
  } else {
    res.redirect('/');
  }
});

app.get('/', function(req, res,next){
	res.render("login",{layout: "mainLogin"});
});

app.get('/home', function(req, res,next){
	res.render("home");
});
   var port = process.env.PORT || 8080;		
   //start the server
   var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;
     	console.log('Example app listening at http://%s:%s', host, port);

   });

