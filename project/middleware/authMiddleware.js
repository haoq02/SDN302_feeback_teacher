function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    } else {
      res.status(401).json({ message: 'Bạn cần đăng nhập để truy cập' });
    }
  }
  
  module.exports = isAuthenticated;
  