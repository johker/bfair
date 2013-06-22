/**
 * New node file
 */

/*
 *  Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */
exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/usercontroller/'+req.profile.id)
      }
      next()
    }
}