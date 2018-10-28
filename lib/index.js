'use strict';
var jsnx = require('jsnetworkx');

class Graph {
  constructor(nodes) {
    /*
    Initializes a graph, adding its nodes.

    Arguments:
    nodes (array of 2x1 arrays) - 
      Each element in the array represents an ordered pair (x, y) which are the coordinates of a node in the graph.
    */
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
    /*
    Calculates and returns the weight of an edge between two nodes using the distance between them.

    Arguments:
    node1 (int) - 
      The first node index.

    node2 (int) - 
      The second node index.

    Returns:
    distance (var) - 
      The distance between the two points.
    */
    var xdiff = this.G.node.get(node1).x - this.G.node.get(node2).x;
    var ydiff = this.G.node.get(node1).y - this.G.node.get(node2).y;

    var distance = (xdiff ** 2 + ydiff ** 2) ** (1 / 2);
    return distance;
  }

  isConnected() {
    /* 
    Checks if graph is connected by exploring all connections to the node with index 0.
    */
    var visited = [];
    // Stores the nodes whose connections have yet to be explored
    // Code ends when the queue is empty
    var queue = [0];

    while (queue[0] !== undefined) {
      // Look at all edges
      // To make more efficient, remove edges as they are explored
      for (var i = 0; i < this.G.edges().length; i++) {
        if (
          this.G.edges()[i][0] === queue[0] &&
          visited.includes(this.G.edges()[i][1]) === false &&
          queue.includes(this.G.edges()[i][1]) === false
        ) {
          // Adds node to queue if it is connected to current node being explored, is not already in the queue, and is not already visited
          queue.push(this.G.edges()[i][1]);
        } else if (
          this.G.edges()[i][1] === queue[0] &&
          visited.includes(this.G.edges()[i][0]) === false &&
          queue.includes(this.G.edges()[i][0]) === false
        ) {
          queue.push(this.G.edges()[i][0]);
        }
      }
      // Adds current node being explored to visited
      visited.push(queue[0]);
      // Removes current node being explored from queue
      queue.shift();
    }

    // Graph is connected if all nodes were explored
    if (visited.length === this.n) {
      return true;
    }

    return false;
  }

  generate() {
    /*
    Creates an initial set of edges for the graph by randomly adding edges until the graph is connected. Uses the weight() and
    isConnected() functions.
    */
    // Stores which edge is being added
    do {
      var rand1 = Math.floor(this.n * Math.random());
      var rand2;
      do {
        // Selects two random nodes
        rand2 = Math.floor(this.n * Math.random());
      } while (rand1 === rand2); // Prevents loops in graph

      // Adds edge and sets weight
      this.G.addEdge(rand1, rand2, { weight: this.weight(rand1, rand2) });
    } while (this.isConnected() === false); // Continue until graph is connected
  }
}

module.exports = { Graph };
