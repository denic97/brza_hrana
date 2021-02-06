const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

// Konekcija sa bazom
var mysqlConneciton = mysql.createConnection({  
    host: process.env.DATABASE_HOST,  
    user: process.env.DATABASE_USER,  
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE  
  });  
mysqlConneciton.connect(function(err) {  
    if (err) throw err;  
    console.log("MYQSL connected!");  
});

module.exports = mysqlConneciton;