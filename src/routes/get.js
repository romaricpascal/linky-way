module.exports = function (req, res, next) {
  res.locals.value = 5;
  next();
};
