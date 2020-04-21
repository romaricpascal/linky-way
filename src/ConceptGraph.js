const { nanoid } = require('nanoid');
class ConceptGraph {
  /**
   * The list of all the nodes in the graph
   */
  get nodes() {
    return this._nodes;
  }
  /**
   * The list of all the nodes without
   * parents in the graph
   */
  get sources() {
    return this._sources;
  }
  constructor() {
    this._sources = [];
    this._nodes = [];
  }

  addPath(path, { skipLookup = false } = {}) {
    if (typeof path === 'string') {
      return this.addPath(fromString(path, { singleResultAsObject: true }));
    }

    if (Array.isArray(path)) {
      if (!skipLookup) {
        // First let's lookup how much of the existing graph can be reused
        const { existing, remaining } = this.findPath(path);
        if (remaining.length) {
          // Create the nodes that need to be created
          const addedNodes = this.addPath(remaining, { skipLookup: true });
          if (existing.length) {
            // Finally link the existing path to the newly created path
            linkNodes(existing[existing.length - 1], addedNodes[0]);
          }
          // And return all the nodes
          return [...existing, ...addedNodes];
        } else {
          return existing;
        }
      } else {
        const nodes = path.map((path, i) =>
          this.createNode(path, { isSource: !i })
        );
        for (var i = 1; i < nodes.length; i++) {
          linkNodes(nodes[i - 1], nodes[i]);
        }
        return nodes;
      }
    } else {
      return this.findSource(path) || this.createNode(path, { isSource: true });
    }
  }

  findPath(path, { possibleNextRemainingNodes = this._sources } = {}) {
    if (typeof path === 'string') {
      return this.findPath(
        fromString(path),
        arguments[1] // Avoid creating a new object uselessly
      );
    }

    if (Array.isArray(path)) {
      return this.findPath(
        { existing: [], remaining: path },
        arguments[1] // Avoid creating a new object uselessly
      );
    }
    // Carry on traversing only if there are remaining nodes
    if (path.remaining.length) {
      // We look up if the first of the remaning nodes
      // is within the list of possible nodes
      const existingNode = possibleNextRemainingNodes.filter(
        (node) => node.name === path.remaining[0].name
      )[0];
      // If so...
      if (existingNode) {
        // Push the found child into the existing nodes
        path.existing.push(existingNode);
        // And remove the first remaining
        path.remaining.shift();
        // Finally return
        return this.findPath(path, {
          possibleNextRemainingNodes: existingNode.children,
        });
      }
    }
    return path;
  }

  findSource(node) {
    return this.sources.filter((source) => source.name === node.name)[0];
  }

  createNode(node, { isSource = false } = {}) {
    const createdNode = {
      id: nanoid(),
      ...node,
      children: [],
      parents: [],
      entries: [],
    };
    this._nodes.push(createdNode);
    if (isSource) {
      this._sources.push(createdNode);
    }
    return createdNode;
  }
}

/**
 * Creates a list of nodes from a `:` delimited string of node names
 * @param {String} path
 * @param {Object} options
 * @param {boolean} [singleResultAsObject=false] - Whether to return an Object instead of an array if there's only one node
 * @param {string} [delimiter=":"] - The delimiter used to `split` the path
 * @return Array|Object
 */
function fromString(path, { singleResultAsObject, delimiter = ':' } = {}) {
  const nodes = path.split(delimiter).map((name) => ({ name }));

  if (singleResultAsObject && nodes.length === 1) {
    return nodes[0];
  }

  return nodes;
}

/**
 * @param {*} parent
 * @param {*} child
 */
function linkNodes(parent, child) {
  child.parents.push(parent);
  parent.children.push(child);
}

exports.ConceptGraph = ConceptGraph;
