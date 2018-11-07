[![Coverage Status](https://coveralls.io/repos/github/wfunkenbusch/Markov-Chain-Monte-Carlo/badge.svg?branch=master)](https://coveralls.io/github/wfunkenbusch/Markov-Chain-Monte-Carlo?branch=master)

# Markov-Chain-Monte-Carlo

Performs a Markov Chain Monte-Carlo simulation on a set of nodes to determine the best graphs for a particular weight function.

The relative probability of accepting a graph, $j$, from a graph $i$ is given by

$$f(\{X_i\},\{X_j\}) = e^{-(\Theta(X_j) - \Theta(X_i))/T}$$

where

$$\Theta(X_i) = r \sum_e w_e + \sum_k^M \sum_{e \in p_{0k}} w_e$$

where $e$ is an edge, $w_e$ is the weight of an edge (the distance between the two nodes it connects), $k$ is a node, $M$ is the total number of nodes, and $p_{0k}$ is the shortest path length between the source node (index 0) and node $k$. r is a constant which determines the importance of total edge weight versus shortest path length. A larger r value gives more importance to total graph edge weight. T represents the ease of accepting the proposal distribution. A larger T makes it easier to accept the proposal distribution.

Implementation:
* Run using Javascript, node.js (v8 or above)
* Needs the following modules installed: jsnetworkx, lodash-clonedeep, command-line-args, mocha (for testing), assert (for testing), istanbul (for coverage), and coveralls mocha-lcov-reporter (for coverage)

1. npm install wfunkenbusch-markov-chain-monte-carlo
2. Create a .js file which calls the main function and sets inputs
3. node *file name*.js

Alternatively,

1. git clone https://github.com/wfunkenbusch/Markov-Chain-Monte-Carlo
2. Enter repository
3. node ./lib/index.js/ --nodes *nodes* --T *T* --r *r* --N *N*

To run unit tests:

1. Enter repository
2. npm test

Example .js file:

const mcmc = require('wfunkenbusch-markov-chain-monte-carlo')
var options = {};
options.nodes = '0, 0, 1, 1, 1, -1, -1, 1';
options.T = 1;
options.r = 1;
options.N = 100;
mcmc.main(options);

Arguments:
* nodes
    * type: string
    * Node coordinates given as comma separated values in a string. The format is 'x1, y1, x2, y2, x3, y3, ..., xM, yM', where xi is the x coordinate of node i, and yi is the y coordinate of node i.

* T
    * type: float
    * Scaling factor for the ease of acceptance of a new proposal distribution. A larger T makes it easier to accept a proposal distribution. Must be positive.

* r
    * type: float
    * Scaling factor for the relative importance of total edge weight versus shortest path length. A larger r gives more importance to total edge weight.

* N
    * type: integer
    * Total number of times to run the Markov Chain Monte-Carlo simulation. As the number of nodes increase, this value should also increase. The value should be large enough that the effect of the initial distribution is small.

Outputs:

All outputs are printed to the console.

* Current iteration number, for keeping track of code progress. To suppress, comment out console.log(i + 1) in main(). To reduce the number of outputs, console.log(i + 1) may be replaced with:

if ((i + 1) % n === 0) {
    console.log(i + 1)
}

where n is the fraction of outputs to print.

* The top 1% of adjacency matrices, followed by the number of times they appeared. Prioritizes graphs which appeared earlier. To change the percentage of top graphs printed, replace the line

var nBestGraphs = Math.floor(Fun.AList.length / 100 + 1);

with

var nBestGraphs = Math.floor(Fun.AList.length * (*fraction to print*) + 1);

* The expected number of edges connected to the source node.
* The expected number of edges in the graph.
* The expected value of the maximum shortest path from the source node to all other nodes.

Note: the total number of adjacency matrices is N + 1.