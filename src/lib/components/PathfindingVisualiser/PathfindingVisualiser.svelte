<script lang="ts">
  import { onMount } from 'svelte';
  import shallowEqual from '$lib/scripts/shallowEqual';

  import VisualNode from '$lib/components/PathfindingVisualiser/VisualNode.svelte';

  import { nodes } from '$lib/nodeStore';
  import Dijkstra from '$lib/components/algorithms/dijkstra.svelte';

  import { computeDelay } from '$lib/globalsStore';

  let gridSize: { width: number; height: number } = { width: 30, height: 30 };
  let grid: HTMLElement;
  let nodeSize: number;

  let mounted: boolean = false;
  onMount(() => {
    let gridElementSize = { width: grid.offsetWidth, height: grid.offsetHeight };
    nodeSize = Math.min(
      Math.floor(gridElementSize.width / gridSize.width),
      Math.floor(gridElementSize.height / gridSize.height)
    );

    let startPos: Path.Point = { x: 0, y: 0 };
    let endPos: Path.Point = { x: 29, y: 29 };

    function initNodes() {
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
              partOfShortestPath: false,
            },
          ];
        }
      }
    }
    initNodes();
    mounted = true;
  });
  function resetVisited() {
    $nodes = $nodes.map((node) => {
      return { ...node, weight: Infinity, visited: false, partOfShortestPath: false };
    });
  }

  function clearWalls() {
    $nodes = $nodes.map((node) => {
      return { ...node, isWall: false };
    });
  }
</script>

<div id="grid-controls">
  <div>
    <button on:click={resetVisited}>Clear algorithm</button>
    <button on:click={clearWalls}>Clear Walls</button>
  </div>
  <div>
    <input type="range" min="0" max="500" step="10" bind:value={$computeDelay} />
    {$computeDelay}
  </div>
  <div>
    <Dijkstra />
  </div>
</div>

<!-- Ignore type error below: typescript no likey but this is only working solution -->
<div id="grid" bind:this={grid} ondragstart="return false;">
  {#if mounted}
    {#each { length: gridSize.width } as _, i}
      <div>
        {#each $nodes as node}
          {#if node.position.x == i}
            <VisualNode bind:node bind:nodeSize />
          {/if}
        {/each}
      </div>
    {/each}
  {/if}
</div>

<style lang="scss">
  #grid {
    height: 90%;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
  }

  #grid-controls {
    height: 10%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
</style>
