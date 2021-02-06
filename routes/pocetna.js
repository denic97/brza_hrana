var express = require('express');
const { reset } = require('nodemon');
var router = express.Router();
var mysqlConneciton = require('../conection');

// GET home page.
router.get('/', function(req, res){
    mysqlConneciton.query("SELECT * FROM proizvodi", (err, rs) => {
        if (err) {
            console.log(err);
        }
        else {
            var isLogin = false;

            // if user is authenticated in the session, carry on
            if (req.isAuthenticated()){
                isLogin = true;
            }
            res.render('pocetna/pocetna',{
                title: 'Pocetna',
                proizvod: rs,
                message: '',
                isLogin: isLogin
            });
        }
    });
});
// Export
module.exports = router;