const { ConceptGraph } = require('./ConceptGraph');

class Store {
  constructor() {
    this._entries = [];
    this._concepts = new ConceptGraph();
  }

  get entries() {
    return this._entries;
  }

  get concepts() {
    return this._concepts.nodes;
  }

  get conceptGraph() {
    return this._concepts;
  }

  addEntry(entry) {
    return this.updateEntry(entry) || this.createEntry(entry);
  }

  updateEntry({ concepts, ...entry }) {
    const existingEntry = this.findEntry(entry);
    if (existingEntry) {
      existingEntry.title = entry.title;
      this.addConceptsToEntry(concepts, existingEntry);
    }
    return existingEntry;
  }

  findEntry(entry) {
    return this._entries.filter((possible) => possible.url === entry.url)[0];
  }

  createEntry({ concepts, ...entry }) {
    const createdEntry = { ...entry, concepts: [] };
    this.addConceptsToEntry(concepts, createdEntry);
    this._entries.push(createdEntry);
    return createdEntry;
  }

  addConceptsToEntry(concepts, entry) {
    if (concepts && concepts.length) {
      // The `.length` check saves unnecessary map and forEach if array is empty
      concepts
        .map((concept) => this._concepts.addPath(concept))
        .map((conceptOrConcepts) => {
          if (Array.isArray(conceptOrConcepts) && conceptOrConcepts.length) {
            return conceptOrConcepts[conceptOrConcepts.length - 1];
          }
          return conceptOrConcepts;
        })
        .forEach((concept) => linkEntryAndConcepts(entry, concept));
    }
  }
}

function linkEntryAndConcepts(entry, concept) {
  entry.concepts.push(concept);
  concept.entries.push(entry);
}

exports.Store = Store;
