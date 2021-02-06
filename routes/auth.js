var express = require('express');
const { query } = require('../conection');
var router = express.Router();
var mysqlConneciton = require('../conection');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// ? GET prikaz login strane
router.get('/login' ,function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('login/login', { 
		title: 'Login',
		message: req.flash('loginMessage'),
		isLogin: ''
    });
});

//! POST login
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
    failureMessage : true // allow flash messages
}), async(req, res) => {
	console.log("hello");
	if (req.body.remember) {
		req.session.cookie.maxAge;
	} else {
		req.session.cookie.expires = false;
	}
	res.redirect('/');
});

//? GET prikaz registracija strane
router.get('/registracija', async (req, res, next) => {
    res.render('registracija/registracija', {
        title: 'Registracija',
		message: '' ,
		isLogin: ''
    });
});

//! POST registracija
router.post('/registracija', async (req, res, next) => {
    console.log(req.body);
    const { ime, prezime, email, lozinka, ponovi_lozinku, code } = req.body;
    
    mysqlConneciton.query(`SELECT email FROM korisnici WHERE email = ?`, [email], async (err, rs) => {
        if(err){
            console.log(err);
        }
        else{
            if( rs.length > 0 ){
                return res.render('registracija/registracija',{
                    title: 'Registracija',
					message: 'Email koji ste uneli vec postoji u bazi!',
					isLogin: ''
                });
            }
            else if(lozinka !== ponovi_lozinku){
                return res.render('registracija/registracija', {
                    title: 'Registracija',
					message: 'Lozinke se ne poklapaju',
					isLogin: ''
                });
            }
        } 
        let hashedPassword = await bcrypt.hash(lozinka, 10);
        console.log(hashedPassword);

        mysqlConneciton.query(`INSERT INTO korisnici SET ?`, { ime: ime, prezime: prezime, email: email, lozinka: hashedPassword, admin: code }, (err, rs) => {
            if(err){
                console.log(err);
            }
            else{
                res.render('registracija/registracija', {
                    title: 'Registracija',
					message: 'Uspesno ste se registrovali!',
					isLogin: ''
                });
            }
        });
	});
});

//! GET Logout
router.get('/logout', function(req, res) {
	req.logout();
	passport.deserializeUser;
	res.redirect('/');
});

//? Funkcija uzima iz baze podatke za proveru da li je korisnik adim.
let isAdmin = ()=>{
	mysqlConneciton.query(`SELECT * FROM korisnici WHERE email = ?`,[email], async (err, ress) => {
		console.log(ress);	
	});
}

// Export
module.exports = router, isAdmin;
