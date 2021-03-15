exports.getHome = async (req, res, next) => {
  try {    
    res.render('frontend/index', {
      pageTitle: 'Home',
      path: '/',      
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
