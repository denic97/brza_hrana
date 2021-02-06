var express = require('express');
var router = express.Router();
var mysqlConneciton = require('../conection');
var Cart = require('../models/cart');

//? GET home page.
router.get('/', function(req, res){
    var isLogin = false;

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        isLogin = true;
    }
    var cart = new Cart(req.session.cart);
    res.render('poruci/poruci',{
        title: 'Poruci',
        isLogin: isLogin,
        ukupnaCena: cart.totalPrice,
        message: ''
    });
});

router.post('/poruci', async(req, res, next) =>{
    
    var cart = new Cart(req.session.cart);
    const { ime, email, broj_tel, adresa } = req.body;
    console.log(req.body);
    res.render('poruci/poruci', {
        title: 'Poruci',
        isLogin: '',
        ukupnaCena: cart.totalPrice,
        message: ('Uspesno ste porucili ' + cart.totalQty + ' pice. Vas racun iznosi: ' + cart.totalPrice)

    });
});


router.get('/dodaj-u-korpu/:id/:cena/:naziv', async(req, res, next) =>{
    var productId = req.params.id;
    var price = req.params.cena;
    var naziv = req.params.naziv;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    mysqlConneciton.query(`SELECT * FROM proizvodi WHERE id = ?`, [productId], async(err, rs) =>{
        if(err) {
            console.log(err);
        }
        cart.add({rs}, productId, price, naziv);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/meni');
    });
});

router.get('/korpa', async(req, res, next) =>{
    if(!req.session.cart){
        return res.render('poruci/korpa', {
            title: 'Korpa',
            proizvodi: null
        });
    }
    var cart = new Cart(req.session.cart);
    res.render('poruci/korpa',{
        title: 'Korpa',
        proizvodi: cart.generateArray(),
        ukupnaCena: cart.totalPrice
    });
});





// Export
module.exports = router;