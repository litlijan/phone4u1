const verifyUser = (req, res, next) => {
    if (req.session.userlogged) {
      next();
    } else {
      res.redirect("/");
    }
  };
  
  const userExist = (req, res, next) => {
    if (req.session.userlogged) {
      res.redirect("/user/userdashboard");
    } else {
      next();
    }
  };
  
module.exports = { verifyUser,userExist };