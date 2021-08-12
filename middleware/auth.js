// to ensure when you are loggedout, you cant visit innerpage and when logged in, it takes you direct to the dash board instead of the home route
module.exports = {
  ensureAuth: (req, res, next) => {
    //if not logged in , you can't view this page the object is called
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "Please login to view this resource");
      res.redirect("/users/login");
    }
  },
  ensureGuest: (req, res, next) => {
    //if logged in, any where this object is called will redirect it straight to dashboard
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};

//Then require it as an object where needed
