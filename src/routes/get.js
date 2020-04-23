module.exports = function (req, res, next) {
  res.locals.value = 5;
  res.locals.numberOfEntries = req.store.entries.length;
  res.locals.numberOfConcepts = req.store.concepts.length;
  next();
};
