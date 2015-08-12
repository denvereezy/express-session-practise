var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session'); 
var bodyParser = require('body-parser');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var myConnection = require('express-myconnection');
var users = require('./routes/users');

var dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '951022',
      port: 3306,
      database: 'spaza_shop'
};

app.use(myConnection(mysql, dbOptions, 'single'));
app.use(cookieParser('shhhh, very secret'));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true})); -
app.use(express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.get("/sign_up", function(req, res){

  res.render("sign_up", {layout : "mainLogin"});
})


app.post('/sign_up', function(req, res, next) {
    req.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }

        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
            Username: input.username,
            Password: input.password

        };

        //bcrypt the password===
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(input.password, salt, function(err, hash) {
                // Store hash in your password DB. 
                data.Password = hash;
                connection.query('insert into Users set ?', data, function(err, results) {
                    if (err)
                        console.log("Error inserting : %s ", err);

                    res.redirect('/?status=user_created');
                });
            });
        });


 
    });

});
app.get('/', function(req, res) {

    console.log(req.query.status);	

    res.render('login', {
        layout: false,

    });
});



app.post("/login", function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
   var username = input.username;
    req.getConnection(function(err, connection) {
        if (err)
            return next(err)

        connection.query('SELECT * from Users WHERE Username=?', [username], function(err, users) {
	    
	    console.log(input);
            console.log(users);	    
	    
	    var user = users[0];
	
            bcrypt.compare(input.password, user.Password, function(err, pass) {
            	
		console.log(user);
            	console.log(pass);

                if (err) {
                    console.log(err);
                }
                 
                if (pass) {
                    req.session.user = username;
                    return res.redirect("/hi")
                } else {
                    return res.redirect('/');
                }
            })
        })
    })
})



/*app.post('/logout', function(req, res, next) {

    var msg = "logging out : " + req.session.user;

    delete req.session.user
    console.log(msg);
    return res.redirect('/');

});*/

/*app.use(function(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('login');
});*/
app.use(users.userCheck);

app.get('/hi', function(req, res) {
	res.render('index');
});

/*app.get("/", function(req, res,next){

  res.render("login", {layout : "mainLogin"});
})*/



//app.post("/login",users.get);
 
app.get('/logout', function(req, res){ 
     delete req.session.user
     res.redirect("/");	
});



//app.get('/sign_up',users.show);
//app.post('/users/update/:Id',users.update);
//app.post('/users/add',users.add);
//app.get('/users/delete/:Id', users.delete);
//app.get('/users/users_edit/:user_Id', users.get);
 
app.listen(8124, function(){
    console.log('Server running on port:8124');
});
