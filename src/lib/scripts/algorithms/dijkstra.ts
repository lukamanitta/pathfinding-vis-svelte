import type { Point } from 'src/lib/components/Point';
import type { Node } from 'src/lib/components/Node';

export function dijkstra(
  nodes: Node[],
  startPos: Point,
  endPos: Point
): { nodesVisited: Node[]; shortestPathNodes: Node[] } {
  // Deep copy nodes
  const unvisitedNodes = nodes.map((node) => {
    return { ...node };
  });

  let startNode: Node;
  let endNode: Node;
  unvisitedNodes.forEach((node) => {
    if (JSON.stringify(node.position) === JSON.stringify(startPos)) {
      startNode = node;
    } else if (JSON.stringify(node.position) === JSON.stringify(endPos)) {
      endNode = node;
    }
  });

  startNode.weight = 0;

  const nodesVisited: Node[] = [];
  let shortestPathNodes: Node[] = [];
  let i = 0;
  while (i < unvisitedNodes.length) {
    // sortNodesByWeight(unvisitedNodes);
    console.log(unvisitedNodes.find((node) => node.weight != Infinity));
    const closestNode: Node = unvisitedNodes.shift();
    console.log(closestNode);
    if (closestNode.isWall) continue;
    if (closestNode.weight === Infinity) return { nodesVisited, shortestPathNodes };
    closestNode.visited = true;
    nodesVisited.push(closestNode);
    if (JSON.stringify(closestNode.position) === JSON.stringify(endNode.position)) {
      shortestPathNodes = calculateShortestPath(nodesVisited);
      return { nodesVisited, shortestPathNodes };
    }
    updateUnvisitedNeighbors(closestNode, nodes);
    i++;
  }

  return { nodesVisited: nodesVisited, shortestPathNodes: unvisitedNodes };
}

function sortNodesByWeight(unvisitedNodes: Node[]) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.weight - nodeB.weight);
}

function updateUnvisitedNeighbors(node: Node, nodes: Node[]) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, nodes);
  for (const neighbour of unvisitedNeighbours) {
    neighbour.weight = node.weight + 1;
    neighbour.previousNode = node;
  }
  // unvisitedNeighbours.map((neighbour) => {
  //   return { ...neighbour, weight: node.weight + 1, previousNode: node };
  // });
}

function getUnvisitedNeighbours(node: Node, nodes: Node[]): Node[] {
  const neighbours: Node[] = [];
  const directions = [1, -1];
  for (let x = 0; x < directions.length; x++) {
    const dX = directions[x];
    for (let y = 0; y < directions.length; y++) {
      const dY = directions[y];
      neighbours.push(
        getNodeByPosition(nodes, { x: node.position.x + dX, y: node.position.y + dY })
      );
    }
  }
  return neighbours.filter((neighbour) => neighbour != undefined && !neighbour.visited);
}

function getNodeByPosition(nodes: Node[], position: Point): Node {
  let targetNode: Node;
  nodes.forEach((node) => {
    if (JSON.stringify(node.position) === JSON.stringify(position)) {
      targetNode = node;
    }
  });
  return targetNode;
}

function calculateShortestPath(nodesVisited: Node[]): Node[] {
  const shortestPathNodes: Node[] = [];
  let currentNode = nodesVisited[-1];
  while (currentNode !== null) {
    shortestPathNodes.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return shortestPathNodes;
}
