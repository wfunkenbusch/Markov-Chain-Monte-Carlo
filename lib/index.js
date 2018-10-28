'use strict';
var jsnx = require('jsnetworkx');

module.exports = {};

class Graph {
  // Initializes graph
  constructor(nodes) {
    // Stores the current graph
    var G = new jsnx.Graph();

    // Adds each node given as input
    for (var i = 0; i < nodes.length; i++) {
      G.addNode(i, { x: nodes[i][0], y: nodes[i][1] });
    }

    // Stores important class variables
    this.G = G;
    this.n = nodes.length;
  }

  // Calculates and returns the weight of an edge between two nodes using the distance formula
  // node1 and node2 are the node indices (starting from 0)
  weight(node1, node2) {
    var xdiff = this.G.node.get(node1).x - this.G.node.get(node2).x;
    var ydiff = this.G.node.get(node1).y - this.G.node.get(node2).y;

    var distance = (xdiff ** 2 + ydiff ** 2) ** (1 / 2);
    return distance;
  }

  isConnected() {
    var visited = [];
    var queue = [0];

    while (queue[0] !== undefined) {
      for (var i = 0; i < this.G.edges().length; i++) {
        if (
          this.G.edges()[i][0] === queue[0] &&
          visited.includes(this.G.edges()[i][1]) === false &&
          queue.includes(this.G.edges()[i][1]) === false
        ) {
          queue.push(this.G.edges()[i][1]);
        } else if (
          this.G.edges()[i][1] === queue[0] &&
          visited.includes(this.G.edges()[i][0]) === false &&
          queue.includes(this.G.edges()[i][0]) === false
        ) {
          queue.push(this.G.edges()[i][0]);
        }
      }
      visited.push(queue[0]);
      queue.shift();
    }

    if (visited.length === this.n) {
      return true;
    }

    return false;
  }

  // Creates an initial set of edges by randomly adding edges until the graph is connected
  // Uses the weight() function and is_connected() function
  generate() {
    // Stores which edge is being added
    var i = 0;
    do {
      var rand1 = 0;
      var rand2 = 0;
      do {
        // Selects two random nodes
        rand1 = Math.floor(this.n * Math.random());
        rand2 = Math.floor(this.n * Math.random());
      } while (rand1 === rand2); // Prevents loops in graph

      // Adds edge and sets weight
      this.G.addEdge(rand1, rand2);
      this.G.adj.get(i).weight = this.weight(rand1, rand2);
      i += 1;
    } while (this.isConnected() === false); // Continue until graph is connected
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

module.exports = { Operations, Graph };
