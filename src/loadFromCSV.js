const { createReadStream } = require('fs');
const { parse } = require('csv');
const { Store } = require('./Store');

const COLUMN_MAPPING = {
  url: 0,
  title: 1,
  concepts: 2,
};

/**
 * Reads the graph stored at the given `csvPath`
 */
exports.read = async function read(csvPath, { store = new Store() } = {}) {
  // Trim whitespace and skip first line
  const parser = parse({ trim: true, from_line: 2 });
  await new Promise((resolve) => {
    createReadStream(csvPath, { encoding: 'utf-8' })
      .pipe(parser)
      .on('data', (record) => {
        const entry = fromRecord(record);
        entry.concepts = entry.concepts.split(',').map((v) => v.trim());
        store.addEntry(entry);
      })
      .on('end', resolve);
  });
  return store;
  // Look for a CSV file called `links/data.csv`
  // Parse the CSV, ignoring the first row
  // For each row:
  //
  // - create the associated link if it does not exist
  // - create the associated tags if they do not exist
  // - attach the link to the associated tag
};

function fromRecord(record, { mapping = COLUMN_MAPPING } = {}) {
  const entry = {};
  Object.entries(mapping).forEach(([property, index]) => {
    entry[property] = record[index];
  });
  return entry;
}

/**
 * Writes the content of the graph into the given contentDirectory
 */
exports.write = function write() {
  // Grab all the links with their tags associated to them
  // Write them down to the CSV file.
};
