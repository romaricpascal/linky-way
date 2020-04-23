const { resolve } = require('path');
const { expect } = require('chai');
const { Store } = require('../Store');
const { read } = require('../loadFromCSV');

describe('loadFromCSV', () => {
  describe('read()', () => {
    it('Reads the given CSV file into a store', async function () {
      const store = await read(csvPath());
      expect(store.entries).to.have.length(4);
      expect(store.concepts).to.have.length(8);
    });
    it('Adds entries to the given store', async function () {
      const store = new Store();
      // Add an entry with a URL that's not in the CSV file
      // to check that new entries will be added
      store.addEntry({
        url: 'http://example.com/non-existing',
        title: 'Non existing entry',
        concepts: ['css'],
      });
      // And one with a url inside the file to check that it'll get updated
      const updatedEntry = store.addEntry({
        url: 'http://example.org/grid-in-design',
        title: 'original title',
        concepts: ['layout'],
      });

      const result = await read(csvPath(), { store });

      expect(result.entries).to.have.length(5);
      expect(result.concepts).to.have.length(9);
      expect(updatedEntry.title).to.equal('Example 2');
      expect(updatedEntry.concepts).to.have.length(2);
    });
  });
});

function csvPath() {
  return resolve(__dirname, 'loadFromCSV/graph.csv');
}
