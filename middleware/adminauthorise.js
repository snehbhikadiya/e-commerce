exports.authorise = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type === 'admin') {
      return next();
    }
    return res.redirect('/adminlogin');
  };
  
  exports.notautherise = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/admin');
  };
  