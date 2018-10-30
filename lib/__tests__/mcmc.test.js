'use strict';
const assert = require('assert');
const mcmc = require('../index.js');

// Tests if constructor properly adds nodes to class graph
describe('graph', () => {
  it('inputs nodes properly', () => {
    var nodes = [[1, 2], [3, 4]];
    var Graph = new mcmc.Graph(nodes);
    assert.equal(Graph.G.node.get(0).x, 1);
    assert.equal(Graph.G.node.get(1).x, 3);
    assert.equal(Graph.G.node.get(0).y, 2);
    assert.equal(Graph.G.node.get(1).y, 4);
  });
});

// Tests if the weight between two nodes is calculated properly
describe('weight', () => {
  it('finds weights properly', () => {
    var nodes = [[2, 2], [5, 6]];
    var Graph = new mcmc.Graph(nodes);
    assert.equal(Graph.weight(0, 1), ((5 - 2) ** 2 + (6 - 2) ** 2) ** (1 / 2));
  });
});

// Tests if the isConnected function properly identifies if a graph is connected
describe('connected', () => {
  it('identifies a connected graph properly', () => {
    var nodes = [[1, 2], [3, 4], [5, 6], [7, 8]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdge(0, 1);
    assert.equal(Graph.isConnected(Graph.G), false);
    Graph.G.addEdge(0, 2);
    assert.equal(Graph.isConnected(Graph.G), false);
    Graph.G.addEdge(2, 3);
    assert.equal(Graph.isConnected(Graph.G), true);
    Graph.G.addEdge(0, 3);
    assert.equal(Graph.isConnected(Graph.G), true);
  });
});

// Tests if the isBridge function properly identifies bridges
describe('bridge', () => {
  it('identifies a bridge properly', () => {
    var nodes = [[0, 0], [1, 1], [2, 2], [3, 3]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3]]);
    assert.equal(Graph.isBridge(Graph.G, 0), false);
    assert.equal(Graph.isBridge(Graph.G, 1), false);
    assert.equal(Graph.isBridge(Graph.G, 2), false);
    assert.equal(Graph.isBridge(Graph.G, 3), true);
  });
});

// Tests if the isBridge function properly restores the edges after being called
describe('restore', () => {
  it('restores the edges', () => {
    var nodes = [[0, 0], [1, 1], [2, 2], [3, 3]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3]]);
    Graph.isBridge(Graph.G, 0);
    assert.equal(Graph.G.edges()[0][1], 1);
  });
});

// Tests if the numberOfBridges function returns the correct number of bridges
describe('number', () => {
  it('identifies the number of bridges properly', () => {
    var nodes = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3], [3, 4]]);
    assert.equal(Graph.numberOfBridges(Graph.G), 2);
  });
});

// Tests if the completeGraph function correctly identifies a complete graph
describe('complete', () => {
  it('identifies a complete graph properly', () => {
    var nodes = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]];
    var Graph = new mcmc.Graph(nodes);
    assert.equal(Graph.completeGraph(Graph.G), false);
    Graph.G.addEdgesFrom([
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4]
    ]);
    assert.equal(Graph.completeGraph(Graph.G), true);
  });
});

// Tests if adjacencyMatrix function returns the correct adjacency matrix
describe('adjacency', () => {
  it('returns the correct adjacency matrix', () => {
    var nodes = [[0, 0], [0, 1], [0, 2]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdgesFrom([[0, 1], [0, 2]]);
    var A = Graph.adjacencyMatrix(Graph.G);
    assert.equal(A[0][0], 0);
    assert.equal(A[1][0], 1);
    assert.equal(A[0][1], 1);
    assert.equal(A[0][2], 2);
    assert.equal(A[1][2], 0);
  });
});

// Tests if storeA stores an adjacency matrix properly
describe('store', () => {
  it('stores adjacency matrices properly', () => {
    var nodes = [[0, 0], [0, 1], [0, 2]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdgesFrom([[0, 1], [0, 2]]);
    var A = Graph.adjacencyMatrix(Graph.G);
    Graph.storeA(A);
    Graph.storeA(A);
    Graph.G.addEdge(1, 2);
    A = Graph.adjacencyMatrix(Graph.G);
    Graph.storeA(A);
    assert.equal(Graph.AListCount[0], 2);
    assert.equal(Graph.AListCount[1], 1);
    assert.equal(toString(Graph.AList[0]), toString(A));
  });
});

// Tests if vulnerableEdges identifies edges which may be added or removed
describe('vulnerable', () => {
  it('identifies vulverable edges properly', () => {
    var nodes = [[0, 0], [0, 1], [0, 2], [0, 3]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3]]);
    var add = Graph.vulnerableEdges(Graph.G)[0];
    var remove = Graph.vulnerableEdges(Graph.G)[1];
    assert.equal(add.length, 2);
    assert.equal(remove.length, 3);
    assert.equal(toString(add[0]), toString([0, 3]));
    assert.equal(toString(remove[0]), toString([0, 1]));
  });
});

// Tests if the output graph of the generate function is a connected graph
describe('generate', () => {
  it('generates a connected graph', () => {
    var nodes = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]];
    var Graph = new mcmc.Graph(nodes);
    Graph.generate();
    assert.equal(Graph.isConnected(Graph.G), true);
  });
});
