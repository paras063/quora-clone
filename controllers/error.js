// ---------------   Page Not Found Error  ---------------
exports.get404 = (req, res, next) => {
  res.status(404).render('error/404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn,
  });
};

// ---------------   Logical Error  ---------------
exports.get500 = (req, res, next) => {
  res.status(500).render('error/500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
};
