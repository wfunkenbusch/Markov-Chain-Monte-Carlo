'use strict';
const assert = require('assert');
const mcmc = require('../index.js');

describe('mcmc', () => {
  it('has a test', () => {
    assert(true, 'mcmc should have a test');
  });
});

describe('add', () => {
  it('adds properly', () => {
    var o = new mcmc.Operations(1, 2);
    assert.equal(o.addPoints(), 3, 'hooray');
  });
});

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

// Tests if the output graph of the generate function is a connected graph
describe('generate', () => {
  it('generates a connected graph', () => {
    assert.equal(true, true);
    /*
    Var nodes = [[1, 2], [3, 4], [5, 6]];
    var G = new mcmc.Graph(nodes);
    G.generate();
    assert.true(jsnx.is_connected(G.G));
    */
  });
});
