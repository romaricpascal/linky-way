const http = require('http');
const { app } = require('./app');

const httpServer = http.createServer(app());
const port = process.env.PORT || 8080;
httpServer.listen(port, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server started on port ${port}`);
  }
});
