<script lang="ts">
  import { writable } from 'svelte/store';
  import type { Writable } from 'svelte/store';

  import shallowEqual from '$lib/scripts/shallowEqual';

  import VisualNode from '$lib/components/PathfindingVisualiser/VisualNode.svelte';

  import { nodes } from '$lib/nodeStore';
  import Dijkstra from '$lib/components/algorithms/dijkstra.svelte';

  let gridSize: { width: number; height: number } = { width: 21, height: 21 };
  let startPos: Path.Point = { x: 0, y: 0 };
  let endPos: Path.Point = { x: 18, y: 4 };

  function clearNodes() {
    $nodes = [];
    for (let x = 0; x < gridSize.width; x++) {
      for (let y = 0; y < gridSize.height; y++) {
        let position: Path.Point = { x: x, y: y };

        let isStartNode = shallowEqual(position, startPos);
        let isEndNode = shallowEqual(position, endPos);
        $nodes = [
          ...$nodes,
          {
            position: position,
            weight: Infinity,
            isStartNode: isStartNode,
            isEndNode: isEndNode,
            isWall: false,
            visited: false,
          },
        ];
      }
    }
  }
  clearNodes();

  function clearWalls() {
    $nodes = $nodes.map((node) => {
      return { ...node, isWall: false };
    });
  }
</script>

<div id="grid-controls">
  <button on:click={clearNodes}>Reset Grid</button>
  <button on:click={clearWalls}>Clear Walls</button>
  <Dijkstra {startPos} {endPos} />
</div>

<!-- Ignore type error below: typescript no likey but this is only working solution -->
<div id="grid" ondragstart="return false;">
  {#each { length: gridSize.width } as _, i}
    <div>
      {#each $nodes as node}
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
