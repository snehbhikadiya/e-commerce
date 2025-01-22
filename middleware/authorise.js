exports.authorise = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/login');
  };
  
  exports.adminOnly = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type === 'admin') {
      return next();
    }
    return res.redirect('/login');
  };
  
  exports.notautherise = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect(req.user.type === 'admin' ? '/admin' : '/cart');
  };
  