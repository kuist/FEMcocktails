exports.isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      next();
    } else {
      res.redirect('/auth/login');
    }
  };
  
  exports.isAdmin = (req, res, next) => {
    if (req.session.userId && req.session.isAdmin) {
      next();
    } else {
      res.status(403).render('error', { message: 'Access denied' });
    }
  };