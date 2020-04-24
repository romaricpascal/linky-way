module.exports = function (req, res, next) {
  res.locals.fn = () => false;
  next();
};
