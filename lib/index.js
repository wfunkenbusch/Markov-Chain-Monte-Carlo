'use strict';
const jsnx = require('jsnetworkx');
const clonedeep = require('lodash.clonedeep');
const commandLineArgs = require('command-line-args');

class Graph {
  constructor(nodes) {
    /*
    Initializes a graph, adding its nodes.

    Arguments:
    nodes (array of 2x1 arrays) - 
      Each element in the array represents an ordered pair (x, y) which are the coordinates of a node in the graph.
    */
    // Stores the current graph
    this.G = new jsnx.Graph();

    // Adds each node given as input
    for (var i = 0; i < nodes.length; i++) {
      this.G.addNode(i, { x: nodes[i][0], y: nodes[i][1] });
    }
  }

  // Calculates and returns the weight of an edge between two nodes using the distance formula.
  // node1 and node2 are the node indices (starting from 0).
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

  isConnected(G) {
    /* 
    Checks if graph is connected by exploring all connections to the node with index 0.

    Arguments:
    G - 
    The graph to be checked.
    */
    var visited = [];

    // Stores the nodes whose connections have yet to be explored
    // Code ends when the queue is empty
    var queue = [0];

    while (queue[0] !== undefined) {
      // Look at all edges
      // To make more efficient, remove edges as they are explored
      for (var i = 0; i < G.edges().length; i++) {
        if (
          G.edges()[i][0] === queue[0] &&
          visited.includes(G.edges()[i][1]) === false &&
          queue.includes(G.edges()[i][1]) === false
        ) {
          // Adds node to queue if it is connected to current node being explored, is not already in the queue, and is not already visited
          queue.push(G.edges()[i][1]);
        } else if (
          G.edges()[i][1] === queue[0] &&
          visited.includes(G.edges()[i][0]) === false &&
          queue.includes(G.edges()[i][0]) === false
        ) {
          queue.push(G.edges()[i][0]);
        }
      }
      // Adds current node being explored to visited
      visited.push(queue[0]);

      // Removes current node being explored from queue
      queue.shift();
    }

    // Graph is connected if all nodes were explored
    if (visited.length === G.nodes().length) {
      return true;
    }

    return false;
  }

  isBridge(G, edge) {
    /*
    Tests whether an edge is a bridge.

    Arguments:
    G - 
    The graph to be checked.

    node - 
    The index of the edge.

    Returns:
    true, if the edge is a bridge, false, otherwise.
    */
    // Nodes which are connected by the edge
    var node1 = G.edges()[edge][0];
    var node2 = G.edges()[edge][1];

    // Removes edge from graph
    G.removeEdge(node1, node2);

    // Checks if graph is connected after edge is removed
    // If it is, the edge is not a bridge
    if (this.isConnected(G) === true) {
      G.addEdge(node1, node2, { weight: this.weight(node1, node2) });
      return false;
    }

    G.addEdge(node1, node2, { weight: this.weight(node1, node2) });
    return true;
  }

  numberOfBridges(G) {
    /*
    Finds the number of bridges in the graph.
    
    Arguments:
    G - 
    The graph to be checked.

    Returns:
    The number of bridges in the graph.
    */
    var count = 0;
    for (var i = 0; i < G.edges().length; i++) {
      if (this.isBridge(G, i) === true) {
        count++;
      }
    }
    return count;
  }

  adjacencyMatrix(G) {
    /*
    Finds the adjacency matrix of a graph.

    Arguments:
    G - 
    The graph.

    Returns:
    The adjacency matrix of the graph.
    */
    // Initializes an n x n matrix where n is the number of nodes
    var A = [];
    for (var i = 0; i < G.nodes().length; i++) {
      A[i] = [];
      for (var j = 0; j < G.nodes().length; j++) {
        A[i][j] = 0;
      }
    }

    // Turns proper aij and aji in matrix into the weight of the edge
    for (var k = 0; k < G.edges().length; k++) {
      var node1 = G.edges()[k][0];
      var node2 = G.edges()[k][1];
      A[node1][node2] = this.weight(node1, node2);
      A[node2][node1] = this.weight(node1, node2);
    }
    return A;
  }

  storeA(G) {
    /*
    Stores a given adjacency matrix in a list.
    Also keeps count of how many times a particular matrix appears.

    Arguments:
    G - 
    Graph whose adjacency matrix is to be stored.

    Returns:
    No returns, but list of A's can be called with this.AList, and the count of each A can be called with this.AListCount.
    */
    // Initialize AList if it doesn't exist yet
    var A = this.adjacencyMatrix(G);
    if (typeof this.AList === 'undefined') {
      this.AList = [A];
      this.AListCount = [0];
    }
    var found = false;

    // Checks if A already exists in list, and increments count if it does
    for (var i = 0; i < this.AList.length; i++) {
      if (this.AList[i].toString() === A.toString()) {
        this.AListCount[i] += 1;
        found = true;
      }
    }

    // If A does not already exist in list, adds it to the list
    if (!found) {
      this.AList.push(A);
      this.AListCount.push(1);
    }
  }

  vulnerableEdges(G) {
    /*
    Finds which edges in a graph can be removed or added while maintaining the graph's connectivity and simplicity.

    Arguments:
    G - 
    The graph to be tested.

    Returns:
    edges - 
    An array of two arrays containing first, a list of edges which can be added, and second, a list of edges which can be removed
    Edges are stored as arrays [i, j]. Does not contain [j, i].
    */
    // The adjacency matrix for the graph
    var A = this.adjacencyMatrix(G);

    // The edges which can be added
    var add = [];

    // The edges which can be removed
    var remove = [];

    // Finds which edges can be added
    for (var i = 0; i < G.nodes().length; i++) {
      for (var j = 0; j < G.nodes().length; j++) {
        // Can add any edge which does not exist and does not create a loop
        // i < j instead of i !== j to avoid double counting
        if (i < j && A[i][j] === 0) {
          add.push([i, j]);
        }
      }
    }

    // Finds which edges can be removed
    for (var k = 0; k < G.edges().length; k++) {
      if (this.isBridge(G, k) === false) {
        remove.push([G.edges()[k][0], G.edges()[k][1]]);
      }
    }

    return [add, remove];
  }

  generate() {
    /*
    Creates an initial set of edges for the graph by randomly adding edges until the graph is connected.
    */
    // Stores which edge is being added
    do {
      var node1 = Math.floor(this.G.nodes().length * Math.random());
      var node2;
      do {
        // Selects two random nodes
        node2 = Math.floor(this.G.nodes().length * Math.random());
      } while (node1 === node2); // Prevents loops in graph

      // Adds edge and sets weight
      this.G.addEdge(node1, node2, { weight: this.weight(node1, node2) });
    } while (this.isConnected(this.G) === false); // Continue until graph is connected
  }

  iterate() {
    /*
    Iterates current graph by randomly removing or adding an edge.
    Also calculates q(j|i) and q(i|j).
    New graph is stored as this.H. q(i|j)/q(j|i) is stored as this.qRatio.
    */
    // Finds vulnerable edges
    var [add, remove] = this.vulnerableEdges(this.G);
    var nEdges = add.length + remove.length;

    // Probability of changing an edge is 1/(number of possible edges)
    var qji = 1 / nEdges;

    // Iterated graph
    this.H = clonedeep(this.G);

    // Picking a random edge to add/remove
    var rand = Math.floor(nEdges * Math.random());

    // Adding an edge
    if (rand < add.length) {
      this.H.addEdge(add[rand][0], add[rand][1], {
        weight: this.weight(add[rand][0], add[rand][1])
      });
    }

    // Removing an edge
    else {
      this.H.removeEdge(remove[rand - add.length][0], remove[rand - add.length][1]);
    }

    // Finds q ratio
    var [add2, remove2] = this.vulnerableEdges(this.H);
    var qij = 1 / (add2.length + remove2.length);
    this.qRatio = qij / qji;
  }

  theta(G, r) {
    /*
    Calculates theta function value for a graph. Used to calculate relative probability of graphs.
    theta = r * sum(weights) + sum(shortest path weights).

    Arguments:
    G - 
    Graph to be analyzed.

    r - 
    Relative weight of edges, scaled to the shortest path weight. Must be greater than or equal to 0.

    Returns:
    theta - 
    Theta function value.
    */
    // Calculates sum of weights of edges

    var weights = 0;
    for (var i = 0; i < G.edges().length; i++) {
      weights += this.weight(G.edges()[i][0], G.edges()[i][1]);
    }
    // Multiply by scaling factor, r
    weights *= r;

    // Finds sum of shortest path weights
    var pathLength = 0;
    for (var j = 0; j < G.nodes().length; j++) {
      pathLength += jsnx.dijkstraPathLength(G, {
        source: 0,
        target: j
      });
    }
    var theta = weights + pathLength;
    return theta;
  }

  relativeP(G, H, T, r) {
    /*
    Calculates the relative probability of two graphs in the stationary distribution via the function, piH/piG = e**(-(theta(H) - theta(G))/T).

    Arguments:
    G - 
    The initial graph.

    H - 
    The proposal graph.

    T - 
    A scaling constant for the probability distribution. Must be greater than 0.

    r - 
    A scaling constant for the theta function. Must be greater than or equal to 0.

    Returns:
    piRatio - 
    The relative probability of graph H with respect to graph G.
    */
    // Calculates the theta values of the two graphs
    var thetaG = this.theta(G, r);
    var thetaH = this.theta(H, r);

    // Finds piH/piG
    var piRatio = Math.exp(-(thetaH - thetaG) / T);
    return piRatio;
  }

  acceptOrReject(G, H, T, r) {
    /*
    Accepts or rejects H based on the piRatio and qRatio.
    Acceptance probability = min(1, piRatio*qRatio).

    Arguments:
    G - 
    The initial graph.

    H - 
    The proposal graph.

    T - 
    A scaling constant for the probability distribution. Must be greater than 0.

    r - 
    A scaling constant for the theta function. Must be greater than or equal to 0.

    Returns:
    Returns true, if the change is accepted, and false, otherwise.
    Reverts H to G if the change is rejected.
    */
    // Finding acceptance probability
    var piRatio = this.relativeP(G, H, T, r);
    var Pji = piRatio * this.qRatio;
    var u = Math.random();

    // Accept change if the random value, u, [0, 1] is below the acceptance probability
    // Note that this satisfies the case where Pji > 1
    if (u < Pji) {
      this.G = clonedeep(this.H);
    }
    return this.G !== this.H;
  }
}

function convert(string) {
  /*
  Converts string into array for user inputs. 
  
  Arguments:
  string - 
  Comma separated values containing the x and y coordinates.

  Returns:
  xyArray - 
  Array of arrays containing x, y coordinates of each node: [[x1, y1], [x2, y2], ..., [xn, yn]].
  */

  var xy = JSON.parse('[' + string + ']');
  var xyArray = [];
  for (var i = 0; i < xy.length / 2; i++) {
    xyArray.push([xy[2 * i], xy[2 * i + 1]]);
  }

  return xyArray;
}

function sourceNodeEdges(AList, AListCount) {
  /*
  Finds the expected number of edges connected to the source (index 0) node.

  Arguments:
  AList - 
  An array containing adjacency matrices for the graph.

  AListCount - 
  The ith element of AListCount indicates the number of times the ith element in AList appears as the adjacency matrix.

  Returns: 
  sourceEdges - 
  The expected number of edges connected to the source node.
  */
  // Stores total number of edges connected to source node
  var sourceEdges = 0;
  var N = 0;

  // Adds to total number of edges for each non-zero element in the first row of adjacency matrix
  for (var i = 0; i < AList.length; i++) {
    N += AListCount[i];
    for (var j = 0; j < AList[0].length; j++) {
      if (AList[i][0][j] !== 0) {
        // Adds one for each recurrence of adjacency matrix
        sourceEdges += AListCount[i];
      }
    }
  }

  return sourceEdges / N;
}

function edges(AList, AListCount) {
  /*
  Finds the expected number of total edges in the graph.

  Arguments:
  AList - 
  An array containing adjacency matrices for the graph.

  AListCount - 
  The ith element of AListCount indicates the number of times the ith element in AList appears as the adjacency matrix.

  Returns:
  totalEdges - 
  The expected number of total edges in the graph.
  */
  // Stores the total number of edges
  var totalEdges = 0;
  var N = 0;

  // Adds to total number of edges for each non-zero element above the diagonal of the matrix
  for (var i = 0; i < AList.length; i++) {
    N += AListCount[i];
    for (var j = 0; j < AList[0].length; j++) {
      for (var k = 0; k < AList[0].length; k++) {
        if (j > k && AList[i][j][k] !== 0) {
          totalEdges += AListCount[i];
        }
      }
    }
  }

  return totalEdges / N;
}

function main(options) {
  /*
  Main code. Iterates Metropolis-Hastings N times, keeping track of how often a graph appears.

  Arguments:
  nodes (string) - 
  The nodes of the graph, as x, y coordinates. The first node is considered the "source" node.
  There must be at least two nodes (the source node and one other), or the code will not run properly.
  The format for the string is 'x1, y1, x2, y2,..., xn, yn'.

  T (integer or float) - 
  Scaling function for the acceptance function.
  A larger T value makes it easier to accept the proposal graph.

  r (integer or float) - 
  Scaling function for the weight function.
  Must be greater than or equal to 0 for the code to function properly.
  Larger r values place more emphasis on the total weight of the graph as opposed to the shortest paths from the source node.

  N (integer) - 
  The number of times to run the Metropolis-Hastings algorithm.
  Larger graphs (more nodes) must be run more times.
  */
  // Initializes graph
  var nodes = convert(options.nodes);
  var T = options.T;
  var r = options.r;
  var N = options.N;
  var Fun = new Graph(nodes);
  Fun.generate();
  Fun.storeA(Fun.G);

  // Prints current iteration
  console.log(1);

  // Finds longest shortest path length from source node to a node
  var maxPathLength = 0;

  // Overwrites current longest path if path length for tested node is larger
  for (var o = 0; o < Fun.G.nodes().length; o++) {
    var pathLength = jsnx.dijkstraPathLength(Fun.G, {
      source: 0,
      target: o
    });
    if (pathLength > maxPathLength) {
      maxPathLength = pathLength;
    }
  }

  var totalMaxPathLength = maxPathLength;

  // Metropolis-Hastings algorithm, storing A at each iteration
  for (var i = 0; i < N - 1; i++) {
    Fun.iterate();
    Fun.acceptOrReject(Fun.G, Fun.H, T, r);
    Fun.storeA(Fun.G);

    // Prints current iteration
    console.log(i + 2);

    // Overwrites current longest path if path length for tested node is larger
    maxPathLength = 0;
    for (var p = 0; p < Fun.AList[0][0].length; p++) {
      // eslint-disable-next-line block-scoped-var
      pathLength = jsnx.dijkstraPathLength(Fun.G, {
        source: 0,
        target: p
      });
      // eslint-disable-next-line block-scoped-var
      if (pathLength > maxPathLength) {
        // eslint-disable-next-line block-scoped-var
        maxPathLength = pathLength;
      }
    }

    totalMaxPathLength += maxPathLength;
  }

  for (var k = 0; k < Fun.AList.length; k++) {
    console.log(Fun.AList[k], Fun.AListCount[k]);
  }

  console.log(
    'Expected number of edges connected to source node:',
    sourceNodeEdges(Fun.AList, Fun.AListCount)
  );
  console.log('Expected total number of edges', edges(Fun.AList, Fun.AListCount));
  console.log(
    'Expected maximum shortest path from source node to a node',
    totalMaxPathLength / N
  );
}

if (require.main === module) {
  /*
  Takes user inputs.
  */
  const input = [
    { name: 'nodes', type: Array },
    { name: 'T', type: Number },
    { name: 'r', type: Number },
    { name: 'N', type: Number }
  ];

  const options = commandLineArgs(input);
  main(options);
}

module.exports = { Graph, convert, sourceNodeEdges, edges, main };
