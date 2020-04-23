const http = require('http');
const { app } = require('./app');
const { read } = require('./loadFromCSV');

(async function () {
  const path = process.env.LW_CSV_PATH;
  if (!path) {
    throw new Error(
      'Please provide a path to the CSV file using the LW_CSV_PATH environment variable'
    );
  }

  const store = await read(path);

  const httpServer = http.createServer(app(store));
  const port = process.env.PORT || 8080;
  httpServer.listen(port, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log(`Server started on port ${port}`);
    }
  });
})();
