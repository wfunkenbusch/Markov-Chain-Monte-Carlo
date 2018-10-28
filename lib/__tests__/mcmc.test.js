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
