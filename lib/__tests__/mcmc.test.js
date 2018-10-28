'use strict';
const assert = require('assert');
const mcmc = require('../index.js');

// Tests if constructor properly adds nodes to class graph
describe('graph', () => {
  it('inputs nodes properly', () => {
    var nodes = [[1, 2], [3, 4]];
    var G = new mcmc.Graph(nodes);
    assert.equal(G.G.node.get(0).x, 1);
    assert.equal(G.G.node.get(1).x, 3);
    assert.equal(G.G.node.get(0).y, 2);
    assert.equal(G.G.node.get(1).y, 4);
  });
});

// Tests if the weight between two nodes is calculated properly
describe('weight', () => {
  it('finds weights properly', () => {
    var nodes = [[2, 2], [5, 6]];
    var G = new mcmc.Graph(nodes);
    assert.equal(G.weight(0, 1), ((5 - 2) ** 2 + (6 - 2) ** 2) ** (1 / 2));
  });
});

// Tests if the isConnected function properly identifies if a graph is connected
describe('connected', () => {
  it('identifies a connected graph properly', () => {
    var nodes = [[1, 2], [3, 4], [5, 6], [7, 8]];
    var G = new mcmc.Graph(nodes);
    G.G.addEdge(0, 1);
    assert.equal(G.isConnected(), false);
    G.G.addEdge(0, 2);
    assert.equal(G.isConnected(), false);
    G.G.addEdge(2, 3);
    assert.equal(G.isConnected(), true);
    G.G.addEdge(0, 3);
    assert.equal(G.isConnected(), true);
  });
});

// Tests if the isBridge function properly identifies bridges
describe('bridge', () => {
  it('identifies a bridge properly', () => {
    var nodes = [[0, 0], [1, 1], [2, 2], [3, 3]];
    var G = new mcmc.Graph(nodes);
    G.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3]]);
    assert.equal(G.isBridge(0), false);
    assert.equal(G.isBridge(1), false);
    assert.equal(G.isBridge(2), false);
    assert.equal(G.isBridge(3), true);
  });
});

// Tests if the isBridge function properly restores the edges after being called
describe('restore', () => {
  it('restores the edges', () => {
    var nodes = [[0, 0], [1, 1], [2, 2], [3, 3]];
    var G = new mcmc.Graph(nodes);
    G.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3]]);
    G.isBridge(0);
    assert.equal(G.G.edges()[0][1], 1);
  });
});

// Tests if the numberOfBridges function returns the correct number of bridges
describe('number', () => {
  it('identifies the number of bridges properly', () => {
    var nodes = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]];
    var G = new mcmc.Graph(nodes);
    G.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3], [3, 4]]);
    assert.equal(G.numberOfBridges(), 2);
  });
});

// Tests if the output graph of the generate function is a connected graph
describe('generate', () => {
  it('generates a connected graph', () => {
    var nodes = [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
      [11, 12],
      [13, 14],
      [15, 16],
      [17, 18],
      [19, 20]
    ];
    var G = new mcmc.Graph(nodes);
    G.generate();
    assert.equal(G.isConnected(G.G), true);
  });
});
