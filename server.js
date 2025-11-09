// console.log('May Node be with you')
// const express = require('express')
// const app = express()

// Worked on setting up the backend from scratch with Michael Kazin

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 6001;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
    if (err) return console.log(err)
    db = database
    require('./app/routes.js')(app, passport, db);
  }); // connect to our database
  
  require('./config/passport')(passport); // pass passport for configuration
  
  // set up our express application
  app.use(morgan('dev')); // log every request to the console
  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.json()); // get information from html forms
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'))
  
  
  app.set('view engine', 'ejs'); // set up ejs for templating
  
  // required for passport
  app.use(session({
      secret: 'rcbootcamp2021b', // session secret
      resave: true,
      saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

MongoClient.connect('mongodb+srv://justinrafjimenez_db_user:Jb4GBVgcPDyxjHRu@cluster0.rccggbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then
    (client => {
        // console.log('Connected to Database')
        // const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        // app.set('view engine', 'ejs')
        app.use(express.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(express.json())
        // app.get('/', (req, res) => {
            // res.sendFile(__dirname + '/index.html')
        //     db.collection('quotes')
        //         .find().toArray().then(results => {
        //             console.log(results)
        //             res.render('index.ejs', { quotes: results })
        //         })
        //         .catch(error => console.error(error))
        // })
    })

//     }
//     // console.log('Connected to Database')    
// )



// console.log(__dirname)

app.listen(port);
console.log('Come hang out at ' + port);
