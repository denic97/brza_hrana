var express = require('express');
var path = require('path');
var ejsMate = require('ejs-mate');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysqlConneciton = require('./conection');
var cookieParser = require('cookie-parser');
var passport = require('passport');
const LocalStrategy = require('passport-local');
var flash = require('connect-flash');


// Inici. app
var app = express();

require('./config/passport')(passport); // pass passport for configuration


 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// From modules
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cookieParser());

// Express Sassion middleware
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'brza_hrana',
  cookie: { 
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true,
    secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

//middleware to make 'user' available to all templates
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

// Path to view file
var pocetna = require('./routes/pocetna');
var meni = require('./routes/meni');
var poruci = require('./routes/poruci');
var auth = require('./routes/auth');

// Routs
app.use('/', pocetna);
app.use('/meni', meni);
app.use('/poruci', poruci);
app.use('/auth', auth);

//View Engine
app.engine('ejs', ejsMate);
app.set('views'), path.join(__dirname, 'views');
app.set('view engine', 'ejs');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));


// Express Messeges middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// ERROR HEANDLER
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{
    title:'error',
  });
});

// Server
var port = 3000;
app.listen(port, function(){
    console.log('Slusa na portu:' + port);
})