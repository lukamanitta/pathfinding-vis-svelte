<script lang="ts">
  import VisualNode from '$lib/components/PathfindingVisualiser/VisualNode.svelte';
  import type { Point } from '$lib/components/Point';
  import type { Node } from '$lib/components/Node';
  import { dijkstra } from '$lib/scripts/algorithms/dijkstra';

  let gridSize: { width: number; height: number } = { width: 21, height: 21 };
  let startPos: Point = { x: 0, y: 0 };
  let endPos: Point = { x: 18, y: 4 };

  let nodes: Node[] = [];

  function clearNodes() {
    nodes = [];
    for (let x = 0; x < gridSize.width; x++) {
      for (let y = 0; y < gridSize.height; y++) {
        let position = { x: x, y: y };
        let isStartNode = JSON.stringify(position) === JSON.stringify(startPos);
        let isEndNode = JSON.stringify(position) === JSON.stringify(endPos);
        nodes.push({
          position: position,
          weight: isStartNode ? 0 : Infinity,
          isStartNode: isStartNode,
          isEndNode: isEndNode,
          isWall: false,
          visited: false,
        });
      }
    }
  }
  clearNodes();

  function clearWalls() {
    nodes = nodes.map((node) => {
      return { ...node, isWall: false };
    });
  }

  function runDijkstra() {
    let { nodesVisited, shortestPathNodes } = dijkstra(nodes, startPos, endPos);
    console.log(nodesVisited);
    nodesVisited.forEach((nodeVisited) => {
      var index = nodesVisited.indexOf(nodeVisited);
      setTimeout(() => {
        nodes = nodes.map((node) => {
          if (JSON.stringify(node.position) === JSON.stringify(nodeVisited.position)) {
            return { ...nodeVisited };
          }
          return { ...node };
        });
      }, 100 * index);
    });
  }
</script>

<div id="grid-controls">
  <button on:click={clearNodes}>Reset Grid</button>
  <button on:click={clearWalls}>Clear Walls</button>
  <button on:click={runDijkstra}>Dijkstra</button>
</div>

<!-- Ignore type error below: typescript no likey but this is only working solution -->
<div id="grid" ondragstart="return false;">
  {#each { length: gridSize.width } as _, i}
    <div>
      {#each nodes as node}
        {#if node.position.x == i}
          <VisualNode bind:node />
        {/if}
      {/each}
    </div>
  {/each}
</div>

<style lang="scss">
  #grid {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
  }

  #grid-controls {
    margin: 0 auto;
    margin-bottom: 20px;
  }
</style>
