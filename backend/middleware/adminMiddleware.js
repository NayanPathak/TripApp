/**
 * Must run after `protect` so `req.user` is set from the database.
 */
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Admin access required",
  });
};

export default requireAdmin;
