// var express = require('express.io');
var express = require('express')
  , root = '../'
  , mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , expressValidator = require("express-validator")
  , rtc = require(root + 'app/controllers/configcontroller')
 
module.exports = function (app, config, passport) {
	  
	// Use connect-flash middleware.  This will add a `req.flash()` function to
	// all requests, matching the functionality offered in Express 2.x.	  
	app.use(flash());

	
  app.set('showStackError', true)
  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))
  app.use(express.static(config.root + '/public'))
  app.use(express.logger('dev'))  

  
  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')
  app.use(require('stylus').middleware({ src: config.root + '/public' }));

  
  
  app.configure(function () {

	app.locals.pretty = true;	
	// cookieParser should be above session
    app.use(express.cookieParser())
    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    
    //app.use(expressValidator)
    
    // express/mongo session storage
    app.use(express.session({
      secret: rtc.getConfig('cookiesecret'),
      cookie: { maxAge: 24 * 60 * 60 * 1000 },
      store: new mongoStore({
        url: rtc.getConfig('db'),
        collection : rtc.getConfig('sessions')
      })
    }))
    
    
    

    // use passport session
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(express.favicon())

    // routes should be at the last
    app.use(app.router)

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (~err.message.indexOf('not found')) return next()

      // log it
      console.error(err.stack)

      // error page
      res.status(500).render('500', { error: err.stack, title: 'Be Fair: HTTP 500' })
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', { url: req.originalUrl, title: 'Be Fair: HTTP 500' })
    })

  })
}
 