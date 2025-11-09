module.exports = function(app, passport, db) {
    const ObjectId = require('mongodb').ObjectId
    const cheerio = require('cheerio')
    const quotesCollection = db.collection('quotes')


    // Set this up with Michael Kazin

    // normal routes ===============================================================
    
        // show the home page (will also have our login links)
        app.get('/', function(req, res) {
            db.collection('quotes').find().toArray((err, result) => {
                if (err) return console.log(err)
                res.render('account.ejs', {
                user : req.user,
                quotes: result
                }) 
            })
        });
    
        // PROFILE SECTION =========================
        app.get('/index', isLoggedIn, function(req, res) {
            db.collection('quotes').find().toArray((err, result) => {
              if (err) return console.log(err)
              res.render('index.ejs', {
                user : req.user,
                quotes: result
              })
            })
        });


        // =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/index', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/index', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/index');
        });
    });


    
        // LOGOUT ==============================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });



                app.post('/quotes', (req, res) => {
                    fetch(req.body.name).then(function (response) {
                        return response.text();
                    }).then(function (html) {
                
                        // Build document object from the HTML response
                        var doc = cheerio.load(html);
                
                        var title = doc("head title")
                        var meta = doc('meta[name="description"]')
                        
                        quotesCollection.save({
                            'url': req.body.name,
                            'title': title.text(),
                            'description': meta.attr('content')
                        })
                        res.redirect('/index')
                    }).catch(function (err) {
                        console.log('Failed to fetch and scrape URL = ' + req.body.name, err);
                    });
                    
                        
                            // console.log(result)
                            // fetch(req.body.name)
                            // .then((response) => response.text())
                            // .then ((result) => {
                            //     // console.log(result)
                            //     res.redirect('/index')
                            // })
                        // .catch(error => console.error(error))
                })
                app.put('/quotes', (req, res) => {
                    quotesCollection
                        .findOneAndUpdate(
                            { name: 'Yoda' },
                            {
                                $set: {
                                    name: req.body.name,
                                    quote: req.body.quote,
                                },
                            },
                            {
                                upsert: true,
                            }
                        )
                        .then(result => {
                            console.log(result)
                            res.json('Success')
                        })
                        .catch(error => console.error(error))
                    console.log(req.body)
                })
                app.delete('/quotes', (req, res) => {
                    quotesCollection
                    .deleteOne({ name: req.body.name })
                    .then(result => {
                        if (result.deletedCount === 0) {
                            return res.json('No quote to delete')
                          }
                      res.json(`Deleted Darth Vader's quote`)
                    })
                    .catch(error => console.error(error))
                })
                app.listen(6001, function () {
                    console.log('listening on 6001')
                })
            }


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
    
        res.redirect('/');
    }