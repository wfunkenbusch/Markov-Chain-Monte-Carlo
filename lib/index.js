'use strict';
var jsnx = require('jsnetworkx');

module.exports = {};

class Graph {
  constructor(nodes) {
    var G = new jsnx.Graph();

    for (var i = 0; i < nodes.length; i++) {
      G.addNode(i, { x: nodes[i][0], y: nodes[i][1] });
    }

    this.G = G;
    this.n = nodes.length;
  }
}

class Operations {
  constructor(a, b) {
    this.points = [a, b];
  }

  addPoints() {
    var sum = this.points[1] + this.points[0];
    return sum;
  }
}

var nodes = new Operations(1, 2);
var G = new Graph([[1, 2], [3, 4]]);
console.log(nodes.addPoints());
console.log(G.G.node.get(0).x);
console.log(G.G.node.get(1).x);
console.log(G.G.node.get(0).y);
console.log(G.G.node.get(1).y);
module.exports = { Operations, Graph };
