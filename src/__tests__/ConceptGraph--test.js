const { expect } = require('chai');

const { ConceptGraph } = require('../ConceptGraph');

describe('Graph', () => {
  describe('addPath()', () => {
    it('Creates a unique node', () => {
      const graph = new ConceptGraph();
      const nodes = graph.addPath({ name: 'css' });
      expect(nodes.id).not.to.be.undefined;
      expect(graph.nodes.length).to.equal(1);
      expect(graph.sources.length).to.equal(1);
    });
    it('Creates multiple new nodes and links them together', () => {
      const graph = new ConceptGraph();
      const nodes = graph.addPath([
        { name: 'css' },
        { name: 'property' },
        { name: 'display' },
      ]);

      expect(nodes).to.have.length(3);
      expect(graph.nodes.map((node) => node.name)).to.have.members([
        'css',
        'property',
        'display',
      ]);
      expect(graph.sources.map((node) => node.name)).to.have.members(['css']);

      for (var i = 1; i < nodes.length - 1; i++) {
        expect(nodes[i].children).to.include(nodes[i + 1], 'children');
      }
      for (var j = nodes.length - 1; j > 1; j--) {
        expect(nodes[i].parents).to.include(nodes[i - 1], 'parents');
      }
    });
    describe('String shorthand', () => {
      it('Creates a unique node from a string', () => {
        const graph = new ConceptGraph();
        const node = graph.addPath('css');
        expect(node.name).to.equal('css');
        expect(graph.nodes).to.have.length(1);
        expect(graph.sources).to.have.length(1);
      });
      it('Creates multiple new nodes from a string', () => {
        const graph = new ConceptGraph();
        const nodes = graph.addPath('css:property:display');
        expect(graph.nodes).to.have.length(3);
        expect(graph.sources).to.have.length(1);
        expect(nodes.map((n) => n.name).join(':')).to.equal(
          'css:property:display'
        );
      });
    });
    describe('Node reuse', () => {
      it('Reuses existing source node when creating a unique node', () => {
        const graph = new ConceptGraph();
        const node1 = graph.addPath({ name: 'css' });
        const node2 = graph.addPath({ name: 'css' });
        expect(node1).to.equal(node2);
      });
      it('Does not reuse non source node when creating a unique node', () => {
        const graph = new ConceptGraph();
        const nodes = graph.addPath([{ name: 'css' }, { name: 'property' }]);
        const node = graph.addPath({ name: 'property' });
        expect(node).not.to.equal(nodes[1]);
      });
      it('Reuses the full existing path if it exists and starts at source', () => {
        const graph = new ConceptGraph();
        const nodes1 = graph.addPath('css:property:display');
        const nodes2 = graph.addPath([
          { name: 'css' },
          { name: 'property' },
          { name: 'display' },
        ]);
        expect(nodes2).to.have.members(nodes1);
      });
      it('Does not reuse nodes if they do not form a path', () => {
        const graph = new ConceptGraph();
        // Add each node independently so they're not linked
        const nodes1 = ['css', 'property', 'display'].map((name) =>
          graph.addPath(name)
        );
        const nodes2 = graph.addPath([
          { name: 'css' },
          { name: 'property' },
          { name: 'display' },
        ]);
        expect(nodes2).not.to.have.members(nodes1);
      });
      it('Does not reuse full path if it does not start at a source', () => {
        const graph = new ConceptGraph();
        const nodes1 = graph.addPath('css:property:display');
        const nodes2 = graph.addPath('property:display');
        expect(nodes2).not.to.include.members(nodes1);
      });
      it('Reuses existing parts of the path starting at the source', () => {
        const graph = new ConceptGraph();
        const nodes1 = graph.addPath('css:property:display');
        const nodes2 = graph.addPath('css:property:color');
        expect(nodes2).to.include.members([nodes1[0], nodes1[1]]);
      });
      it('Does not reuse parts of the path that do not start at the source', () => {
        const graph = new ConceptGraph();
        const nodes1 = graph.addPath('css:property:display:grid');
        const nodes2 = graph.addPath('property:display');
        expect(nodes2).not.to.include(nodes1);
      });
    });
  });
  describe('findPath()', () => {
    it('Finds the existing path', () => {
      const graph = new ConceptGraph();
      graph.addPath('css:property:display');
      const result = graph.findPath([
        { name: 'css' },
        { name: 'property' },
        { name: 'display' },
      ]);
      expect(result.existing).to.have.length(3);
    });
    it('Collect remaining nodes to create', () => {
      const graph = new ConceptGraph();
      graph.addPath('css:property:display');
      const result = graph.findPath([
        { name: 'css' },
        { name: 'property' },
        { name: 'display' },
        { name: 'grid' },
      ]);
      expect(result.existing).to.have.length(3);
      expect(result.remaining).to.have.length(1);
    });
    it('Finds partial existing graph from source', () => {
      const graph = new ConceptGraph();
      graph.addPath('css:property:display');
      const result = graph.findPath([{ name: 'css' }, { name: 'property' }]);
      expect(result.existing).to.have.length(2);
      expect(result.remaining).to.have.length(0);
    });
    describe('String shorthand', () => {
      it('Turns strings into nodes before lookup', () => {
        const graph = new ConceptGraph();
        graph.addPath('css:property:display');
        const result = graph.findPath('css:property:display');
        expect(result.existing).to.have.length(3);
      });
    });
    describe('possibleNextRemainingNodes option', () => {
      it('Allows to specify a list of nodes to lookup the next remaining node', () => {
        const graph = new ConceptGraph();
        const nodes = graph.addPath('css:property:display');
        const result = graph.findPath('property:display', {
          possibleNextRemainingNodes: nodes[0].children,
        });
        expect(result.existing).to.have.length(2);
        expect(result.remaining).to.have.length(0);
      });
    });
  });
});
