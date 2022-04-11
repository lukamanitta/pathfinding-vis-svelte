<script lang="ts">
  import shallowEqual from '$lib/scripts/shallowEqual';

  import { nodes } from '$lib/nodeStore';
  import { computeDelay } from '$lib/globalsStore';

  import { at } from 'core-js/features/array/at.js';

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function dijkstra() {
    let startNode: Path.Node = $nodes.find((node) => node.isStartNode);
    let endNode: Path.Node = $nodes.find((node) => node.isEndNode);

    let visitedNodes: Path.Node[] = [];
    startNode.weight = 0;
    let unvisitedNodes: Path.Node[] = [...$nodes];
    let closestNode: Path.Node = startNode;

    while (true) {
      sortNodesByWeight(unvisitedNodes);
      closestNode = unvisitedNodes.shift();
      if (closestNode.isWall) {
        continue;
      }
      if (closestNode.weight === Infinity) {
        // Exit, must be stuck within walls and end node cannot be found
        return;
      }
      visitedNodes.push(closestNode);
      if ($computeDelay !== 0) {
        await sleep($computeDelay);
      }
      closestNode.visited = true;
      if (shallowEqual(closestNode.position, endNode.position)) {
        calculateShortestPath(visitedNodes);
        return;
      }
      updateUnvisitedNeighbors(closestNode, unvisitedNodes);
      $nodes = $nodes;
    }
  }

  function sortNodesByWeight(unvisitedNodes: Path.Node[]) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.weight - nodeB.weight);
  }

  function updateUnvisitedNeighbors(node: Path.Node, nodes: Path.Node[]) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, nodes);
    for (const neighbour of unvisitedNeighbours) {
      neighbour.weight = node.weight + 1;
      neighbour.previousNode = node;
    }
  }

  function getUnvisitedNeighbours(node: Path.Node, nodes: Path.Node[]): Path.Node[] {
    const neighbours: Path.Node[] = [];
    const directions = [
      { dX: 0, dY: -1 },
      { dX: 0, dY: 1 },
      { dX: -1, dY: 0 },
      { dX: 1, dY: 0 },
    ];

    directions.forEach((direction) => {
      neighbours.push(
        getNodeByPosition(nodes, {
          x: node.position.x + direction.dX,
          y: node.position.y + direction.dY,
        })
      );
    });
    return neighbours.filter((neighbour) => neighbour != undefined && !neighbour.visited);
  }

  function getNodeByPosition(nodes: Path.Node[], position: Path.Point): Path.Node {
    return nodes.find((node) => shallowEqual(node.position, position));
  }

  async function calculateShortestPath(visitedNodes: Path.Node[]) {
    let currentNode = visitedNodes.at(-1);
    while (currentNode !== undefined) {
      currentNode.partOfShortestPath = true;
      await sleep($computeDelay);
      $nodes = $nodes;
      currentNode = currentNode.previousNode;
    }
  }
</script>

<button on:click={() => dijkstra()}>Dijkstra</button>
