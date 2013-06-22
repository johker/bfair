
/**
 * Module dependencies.
 */
var root = '../../'
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , bundle = require(root + 'config/resourcebundle')['en']
  , user; 


/**
* Login handler 
*/
exports.login = function(req, res) {
	res.render('login', { title: bundle.title.login, user: req.user, message: req.flash('error')});
};


exports.overview = function(req, res) {
    res.render('overview', { title: bundle.title.overview, username: req.user.username});
};
 
/**
 * Show login form
 */
exports.login = function (req, res) {
    res.render('login', {
    title: 'Login',
    message: req.flash('error')
  })
}

/**
 * Logout
 */
exports.logout = function (req, res) {
  user = null; 
  req.logout()
  res.redirect('/')
}

/**
 * Session - deprecated
 */

exports.session = function (req, res) {
  res.redirect('/')
}


/**
 *  Show profile - deprecated
 */
exports.show = function (req, res) {
  var user = req.profile
  res.render('usercontroller/show', {
    title: user.name,
    user: user
  })
}

/**
 * Find user by id - deprecated
 */
exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
