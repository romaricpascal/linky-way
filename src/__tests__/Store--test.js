const { expect } = require('chai');

const { Store } = require('../Store');

describe.only('Store', () => {
  describe('add()', () => {
    it('Adds a unique entry to the list of entries', () => {
      const store = new Store();
      store.addEntry({
        url: 'http://example.com',
        title: 'title',
      });
      expect(store.entries).to.have.length(1);
      expect(store.entries[0].url).to.equal('http://example.com');
    });
    describe('concepts attribute', () => {
      it('Links the entry to the given concept', () => {
        const store = new Store();
        const entry = store.addEntry({
          url: 'http://example.com',
          concepts: ['css'],
        });
        expect(store.entries).to.have.length(1);
        expect(store.concepts).to.have.length(1);
        expect(entry.concepts).to.have.members([store.concepts[0]]);
        expect(store.concepts[0].entries).to.have.members([entry]);
      });
      it('Links the entry to the given path', () => {
        const store = new Store();
        const entry = store.addEntry({
          url: 'http://example.com',
          concepts: ['css:property:display'],
        });
        expect(store.entries).to.have.length(1);
        expect(store.concepts).to.have.length(3);
        expect(entry.concepts).to.have.members([store.concepts[2]]);
        expect(store.concepts[2].entries).to.have.members([entry]);
      });
      it('Links an entry to multiple concepts', () => {
        const store = new Store();
        const entry = store.addEntry({
          url: 'http://example.com',
          concepts: ['css:property:display', 'design:grid'],
        });
        expect(store.entries).to.have.length(1);
        expect(store.concepts).to.have.length(5);
        expect(entry.concepts).to.have.members([
          store.concepts[2],
          store.concepts[4],
        ]);
        expect(store.concepts[2].entries).to.have.members([entry]);
        expect(store.concepts[4].entries).to.have.members([entry]);
      });
      it('Links multiple entries to the same concept', () => {
        const store = new Store();
        const entry = store.addEntry({
          url: 'http://example.com',
          concepts: ['css:property:display'],
        });
        const otherEntry = store.addEntry({
          url: 'http://test.com',
          concepts: ['css:property:display'],
        });
        expect(store.entries).to.have.length(2);
        expect(store.concepts).to.have.length(3);
        expect(entry.concepts).to.have.members([store.concepts[2]]);
        expect(otherEntry.concepts).to.have.members([store.concepts[2]]);
        expect(store.concepts[2].entries).to.have.members([entry, otherEntry]);
      });
    });
    describe('Entry reuse', () => {
      it('Reuses entries with the same URL', () => {
        const entries = new Store();
        const entry1 = entries.addEntry({ url: 'http://example.com' });
        const entry2 = entries.addEntry({ url: 'http://example.com' });
        expect(entry2).to.equal(entry1);
      });
      it('Updates the title of entries with same URL', () => {
        const entries = new Store();
        const entry1 = entries.addEntry({
          url: 'http://example.com',
          title: 'original title',
        });
        const entry2 = entries.addEntry({
          url: 'http://example.com',
          title: 'updated title',
        });
        expect(entry2).to.equal(entry1);
        expect(entry2.title).to.equal('updated title');
      });
      it('adds concepts to the existing entry', () => {
        const store = new Store();
        const entry1 = store.addEntry({
          url: 'http://example.com',
          concepts: ['css:property:display'],
        });
        const entry2 = store.addEntry({
          url: 'http://example.com',
          concepts: ['design:grid'],
        });
        expect(entry2).to.equal(entry1);
        expect(entry2.concepts).to.have.members([
          store.concepts[2],
          store.concepts[4],
        ]);
        expect(store.concepts[2].entries).to.have.members([entry2]);
        expect(store.concepts[4].entries).to.have.members([entry2]);
      });
    });
  });
});
