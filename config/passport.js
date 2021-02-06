var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var mysqlConneciton = require('../conection');
var flash = require('connect-flash');


// expose this function to our app using module.exports
module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        mysqlConneciton.query("SELECT * FROM korisnici WHERE id = ? ",[id], function(err, rs){
            done(err, rs[0]);
        });
    });

    // LOCAL LOGIN 
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'lozinka',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, lozinka, done) { // callback with email and password from our form
            mysqlConneciton.query("SELECT * FROM korisnici WHERE email = ?",[email], function(err, rs){
                if (err)
                    return done(err);
                if (!rs.length) {
                    return done(null, false, req.flash('loginMessage', 'Korisnik sa unetim email adresom nije pronadjen.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(lozinka, rs[0].lozinka))
                    return done(null, false); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rs[0]);
            });
        })
    );
};