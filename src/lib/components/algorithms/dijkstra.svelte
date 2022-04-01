<script lang="ts">
  import shallowEqual from '$lib/scripts/shallowEqual';

  import { nodes } from '$lib/nodeStore';
  import { shortestPathNodes } from '$lib/nodeStore';

  export let startPos: Path.Point;
  export let endPos: Path.Point;

  async function dijkstra(startPos: Path.Point, endPos: Path.Point) {
    let startNode: Path.Node = $nodes.find((node) => node.isStartNode);
    let endNode: Path.Node = $nodes.find((node) => node.isEndNode);

    let visitedNodes: Path.Node[] = [];
    startNode.weight = 0;
    let unvisitedNodes: Path.Node[] = [...$nodes];
    let closestNode: Path.Node = startNode;

    let calculateDijkstra = setInterval(() => {
      sortNodesByWeight(unvisitedNodes);
      closestNode = unvisitedNodes.shift();
      if (closestNode.isWall) {
        return;
      }
      if (closestNode.weight === Infinity) {
        // Exit, must be stuck within walls and end node cannot be found
        clearInterval(calculateDijkstra);
      }
      closestNode.visited = true;
      if (shallowEqual(closestNode.position, endNode.position)) {
        // $shortestPathNodes = calculateShortestPath(visitedNodes);
        clearInterval(calculateDijkstra);
      }
      visitedNodes.push(closestNode);
      updateUnvisitedNeighbors(closestNode, unvisitedNodes);
      $nodes = $nodes;
    }, 50);
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

  function calculateShortestPath(nodesVisited: Path.Node[]): Path.Node[] {
    const shortestPathNodes: Path.Node[] = [];
    let currentNode = nodesVisited[-1];
    while (currentNode !== null) {
      shortestPathNodes.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return shortestPathNodes;
  }
</script>

<button on:click={() => dijkstra(startPos, endPos)}>Dijkstra</button>
