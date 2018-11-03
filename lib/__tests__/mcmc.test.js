'use strict';
const assert = require('assert');
const mcmc = require('../index.js');
var clonedeep = require('lodash.clonedeep');

// Tests if constructor properly adds nodes to class graph
describe('graph', () => {
  it('inputs nodes properly', () => {
    var nodes = [[1, 2], [3, 4]];
    var Graph = new mcmc.Graph(nodes);

    // Checks if coordinates are correct
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

    // Checks weight is correct
    assert.equal(Graph.weight(0, 1), ((5 - 2) ** 2 + (6 - 2) ** 2) ** (1 / 2));
  });
});

// Tests if the isConnected function properly identifies if a graph is connected
describe('connected', () => {
  it('identifies a connected graph properly', () => {
    var nodes = [[1, 2], [3, 4], [5, 6], [7, 8]];
    var Graph = new mcmc.Graph(nodes);

    // Checks if graph is connected as edges are added
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

    // Edges such that [2, 3] is a bridge
    Graph.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3]]);

    // Checks if bridges are identified
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

    // Ensures Graph.G is the same after isBridge is run
    assert.equal(Graph.G.edges()[0][1], 1);
  });
});

// Tests if the numberOfBridges function returns the correct number of bridges
describe('number', () => {
  it('identifies the number of bridges properly', () => {
    var nodes = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]];
    var Graph = new mcmc.Graph(nodes);

    // Edges such that [2, 3], and [3, 4] are bridges
    Graph.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3], [3, 4]]);

    // Checks number of bridges
    assert.equal(Graph.numberOfBridges(Graph.G), 2);
  });
});

// Tests if adjacencyMatrix function returns the correct adjacency matrix
describe('adjacency', () => {
  it('returns the correct adjacency matrix', () => {
    var nodes = [[0, 0], [0, 1], [0, 2]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdgesFrom([[0, 1], [0, 2]]);
    var A = Graph.adjacencyMatrix(Graph.G);

    // Checks adjacency matrix is correct
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

    // Stores same graph twice
    Graph.G.addEdgesFrom([[0, 1], [0, 2]]);
    Graph.storeA(Graph.G);
    Graph.storeA(Graph.G);

    // Stores new graph
    Graph.G.addEdge(1, 2);
    var A = Graph.adjacencyMatrix(Graph.G);
    Graph.storeA(Graph.G);

    // Checks double storing of graph works
    assert.equal(Graph.AListCount[0], 2);

    // Checks new graph is stored
    assert.equal(Graph.AListCount[1], 1);

    // Checks that the adjacency matrices stored are correct
    assert.equal(Graph.AList[1].toString(), A.toString());
  });
});

// Tests if vulnerableEdges identifies edges which may be added or removed
describe('vulnerable', () => {
  it('identifies vulverable edges properly', () => {
    var nodes = [[0, 0], [0, 1], [0, 2], [0, 3]];
    var Graph = new mcmc.Graph(nodes);

    // Edges such that [0, 3] and [1, 3] are possible adds and [0, 1], [0, 2], [1, 2] are possible removals
    Graph.G.addEdgesFrom([[0, 1], [0, 2], [1, 2], [2, 3]]);
    var [add, remove] = Graph.vulnerableEdges(Graph.G);

    // Checks that add and remove arrays are correct
    assert.equal(add.length, 2);
    assert.equal(remove.length, 3);
    assert.equal(add[0].toString(), [0, 3].toString());
    assert.equal(remove[0].toString(), [0, 1].toString());
  });
});

// Tests if the output graph of the generate function is a connected graph
describe('generate', () => {
  it('generates a connected graph', () => {
    var nodes = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]];
    var Graph = new mcmc.Graph(nodes);
    Graph.generate();

    // Checks that the graph is connected
    assert.equal(Graph.isConnected(Graph.G), true);
  });
});

// Tests if function iterates properly for a simple case
describe('iterate', () => {
  it('tests if function iterates properly', () => {
    var nodes = [[0, 0], [0, 1], [0, 2]];
    var Graph = new mcmc.Graph(nodes);

    // Edges such that the only possibility is removing an edge
    Graph.G.addEdgesFrom([[0, 1], [0, 2], [1, 2]]);

    // Checks that there are the correct number of edges before and after an iteration for removing an edge
    // Also checks that qRatio is correct
    assert.equal(Graph.G.edges().length, 3);
    Graph.iterate();
    assert.equal(Graph.G.edges().length, 3);
    assert.equal(Graph.H.edges().length, 2);
    assert.equal(Graph.qRatio, 3);
    Graph.G = clonedeep(Graph.H);
    Graph.iterate();

    // Edges are now such that the only possibility is adding an edge
    // Checks that there are the correct number of edges before and after an iteration for adding an edge
    // Also checks that qRatio is correct
    assert.equal(Graph.G.edges().length, 2);
    assert.equal(Graph.H.edges().length, 3);
    assert.equal(Graph.qRatio, 1 / 3);
  });
});

// Tests if theta function calculates properly
describe('theta', () => {
  it('tests if theta function calculates properly', () => {
    var nodes = [[0, 0], [0, 3], [4, 3]];
    var Graph = new mcmc.Graph(nodes);
    Graph.G.addEdgesFrom([[0, 1, { weight: 3 }], [1, 2, { weight: 4 }]]);

    // Checks that thetas are correct for graph with different r values
    assert.equal(Graph.theta(Graph.G, 1), 17);
    assert.equal(Graph.theta(Graph.G, 2), 24);

    // Creates new graph
    Graph.G.addEdgesFrom([[0, 2, { weight: 5 }]]);

    // Checks that thetas are correct for new graph
    assert.equal(Graph.theta(Graph.G, 1), 20);
    assert.equal(Graph.theta(Graph.G, 2), 32);
  });
});

// Tests if relativeP function finds the relative probability of two graphs properly
describe('relativeP', () => {
  it('tests if relativeP function calculates probability properly', () => {
    var nodes = [[0, 0], [0, 3], [4, 3]];
    var Graph = new mcmc.Graph(nodes);

    // Same edges as theta function, so that theta values are already known
    Graph.G.addEdgesFrom([[0, 1, { weight: 3 }], [1, 2, { weight: 4 }]]);
    Graph.iterate();

    // Checks that piRatio is correct for a graph and its proposal, and for different T values
    assert.equal(Graph.relativeP(Graph.G, Graph.H, 1, 1), Math.exp(-(20 - 17)));
    assert.equal(Graph.relativeP(Graph.G, Graph.H, 2, 1), Math.exp(-(20 - 17) / 2));
  });
});

// Tests if function properly accepts or rejects a graph
describe('accept', () => {
  it('tests if acceptOrReject properly accepts or rejects', () => {
    var nodes = [[0, 0], [0, 3], [4, 3]];
    var Graph = new mcmc.Graph(nodes);

    // Edges such that the only possibility is removal of one edge
    Graph.G.addEdgesFrom([
      [0, 1, { weight: 3 }],
      [1, 2, { weight: 4 }],
      [0, 2, { weight: 5 }]
    ]);
    Graph.iterate();

    // Large r value such that the new graph is always accepted (lower overall weight)
    var truth = Graph.acceptOrReject(Graph.G, Graph.H, 1, 1000);

    // Checks that the new graph is accepted
    assert.equal(truth, true);

    // Checks that H was not reverted to G
    assert.notEqual(Graph.G, Graph.H);
  });
});

// Tests if convert turns a string into the proper array
describe('convert', () => {
  it('tests if convert converts to an array properly', () => {
    // String to be converted
    var string = '0, 0, 1, 1, -1, -1, 1, -1';

    // Convert to array
    var nodes = mcmc.convert(string);

    // Compare with expected output
    assert.equal(nodes.toString(), [[0, 0], [1, 1], [-1, -1], [1, -1]].toString());
  });
});

// Tests if main function runs without error
describe('main', () => {
  it('tests if main function runs', () => {
    // Setting user inputs
    var options = {};
    options.nodes = '0, 0, 1, 1, 1, -1, -1, 1';
    options.T = 1;
    options.r = 1;
    options.N = 50;

    // Run function
    mcmc.main(options);
  });
});
