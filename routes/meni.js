var express = require('express');
var router = express.Router();
var mysqlConneciton = require('../conection');
var path = require('path');
var multer = require('multer');
const fs = require('fs');
const isAdmin = require('./auth');
var Cart = require('../models/cart');


//? Uplouding images
// Set Storage Engine
const storage = multer.diskStorage({
    //destination for files
    destination: (req, file, cd) => {
      cd(null, './public/images/uploaded_images');
    },
    //add back the extention
    filename: (req, file, cd) => {
      cd(null, Date.now() + file.originalname);
    }
  });

// upload parametars for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024*1024*3
    }
});

//? GET prikaz srranice MENI
router.get('/', (req, res, next) => {
    mysqlConneciton.query("SELECT * FROM proizvodi", (err, rs) => {
        if (err) {
            throw err;
        }
        else {
            if (req.isAuthenticated()){
                isLogin = true;
                res.render('admin_meni', {
                    title: 'Meni',
                    proizvod: rs,
                    admin: req.user,
                    isLogin: isLogin
                });
            }
            else{
                // async(req, res, next) =>{
                //     res.locals.cart = req.session;
                //     next();
                // };
                var data = 0;
                if(res.locals.session.cart){
                    data = res.locals.session.cart;
                }

                isLogin = false;
                res.render('meni', {
                    title: 'Meni',
                    proizvod: rs,
                    isLogin: isLogin,
                    session: data
                });
            }
        }
    });
});

//? GET prikaz stranice DODAJ_PROIZVOD
router.get('/dodaj_proizvod', isLoggedIn, async (req, res, next) => {
    res.render('proizvodi/dodaj_proizvod', {
        title: 'Dodaj novi proizvod',
        message: '',
        isLogin: isLogin
    })
});

//! POST INSERT dodavanje proizvoda
router.post('/dodaj_proizvod', isLoggedIn, upload.single('img'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const naziv =  req.body.naziv;
    const sadrzaj = req.body.sadrzaj;
    const kategorija = req.body.kategorija;
    const cena = req.body.cena;
    const img_name = req.file.filename;

    mysqlConneciton.query('INSERT INTO proizvodi SET ?', { naziv: naziv, sadrzaj: sadrzaj, kategorija: kategorija, cena: cena, slika: img_name }, (err, rs) => {
        if(err){
            console.log(err);
        }
        else {
            res.render('proizvodi/dodaj_proizvod', {
                title: 'Dodaj novi proizvod',
                message: 'Uspesno ste dodali novi proizvod!',
                isLogin: isLogin
            });
        }
    }); 
});

//? GET prikaz stranice IZMENI_PROIZVOD
router.get('/izmeni_proizvod/:id', isLoggedIn, async (req, res, next) => {
    const sql = `SELECT * FROM proizvodi WHERE id = ${req.params.id}`;
    mysqlConneciton.query(sql, (err, rs) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('proizvodi/izmeni_proizvod', {
                title: 'Izmeni proizvod',
                proizvod: rs,
                isLogin: isLogin
            })
        }
    });
});

//! POST UPDATE izmena proizvoda
router.post('/izmeni_proizvod/:id', isLoggedIn, upload.single('img'), async(req, res) => {
    console.log(req.body);
    console.log(req.file);

    const naziv =  req.body.naziv;
    const sadrzaj = req.body.sadrzaj;
    const kategorija = req.body.kategorija;
    const cena = req.body.cena;
    const img_name = req.file.filename;

    const sql = `UPDATE proizvodi SET ? WHERE id = ${req.params.id}`;

    mysqlConneciton.query(sql, { naziv: naziv, sadrzaj: sadrzaj, kategorija: kategorija, cena: cena, slika: img_name }, (err, rs) => {
        if(err){
            console.log(err);
        }
        else {
            res.redirect('/meni');
        }
    })
}); 

//! POST DELETE brisanje proizvoda
router.get('/izbrisi_proizvod/:id', isLoggedIn, async (req, res, next) => {
    mysqlConneciton.query(`SELECT * FROM proizvodi WHERE id = ${req.params.id}`, (err, rss) =>{
        if(err) {
            console.log(err);
        }
        else {
            console.log(rss[0].slika);
            const path = rss[0].slika;
            fs.unlinkSync('./public/images/uploaded_images/'+ path, (error) => {
                if(error) {
                    throw error;
                }
                console.log('Img deleted!');
            });
        }
    })
    const sql = `DELETE FROM proizvodi WHERE id = ${req.params.id}`;
    mysqlConneciton.query(sql, (err, rs) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log('brisanje');
            res.redirect('/meni');
        }
    })
});

// Export
module.exports = router;


var isLogin = false;
// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
        isLogin = true;
		return next();
    }
    else{
        // if they aren't redirect them to the home page
        var isLogin = false;
	    res.redirect('/meni');
    }
}