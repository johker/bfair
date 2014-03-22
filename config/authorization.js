/**
 * New node file
 */

/*
 *  Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
	sysLogger.notice('<authentication> <requiresLogin> Is authenticated : ' + req.isAuthenticated());
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
    	sysLogger.notice('<authentication> <hasAuthorization> req.profile.id = ' + req.profile.id + ', req.user.id = ' + req.profile.id);
        if (req.profile.id != req.user.id) {
    	return res.redirect('/usercontroller/'+req.profile.id)
      }
      next()
    }
}