<script lang="ts">
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';
  import type { Node } from '$lib/components/Node';
  import type { Point } from '$lib/components/Point';

  export let node: Node;

  let colour = 'green';
  $: {
    if (node.isWall) {
      colour = 'green';
    } else if (node.isStartNode) {
      colour = 'blue';
    } else if (node.isEndNode) {
      colour = 'red';
    } else if (node.visited) {
      colour = 'black';
    } else {
      colour = 'green';
    }
  }

  let hoverColour = 'green';

  $: isSpecial = node.isWall || node.visited || node.isEndNode || node.isStartNode;

  let hovered = false;

  let mouseClicked = false;
  function setMouseClicked(e) {
    let flags = e.buttons !== undefined ? e.buttons : e.which;
    mouseClicked = (flags & 1) === 1;
  }
  onMount(() => {
    document.addEventListener('mousedown', setMouseClicked);
    document.addEventListener('mouseup', setMouseClicked);
  });

  function toggleWall() {
    if (!node.isStartNode && !node.isEndNode) {
      node.isWall = !node.isWall;
      hovered = false;
    }
  }

  function toggleWallOnHover() {
    if (!node.isStartNode && !node.isEndNode && mouseClicked) {
      node.isWall = !node.isWall;
    }
  }
</script>

<div
  class="node"
  on:mousedown={toggleWall}
  on:mouseenter={() => {
    hovered = true;
    toggleWallOnHover();
  }}
  on:mouseout={() => (hovered = false)}
>
  <div class="node-colour" style:background-color="lightblue" />
  {#if (hovered && !isSpecial) || isSpecial}
    <div transition:scale class="node-colour" style:background-color={colour} />
  {/if}
</div>

<style lang="scss">
  .node {
    height: 33px;
    width: 33px;
  }

  .node-colour {
    position: absolute;
    margin: 0px;
    height: 30px;
    width: 30px;
    border-radius: 15%;
    pointer-events: none;
    z-index: 9999;
  }
</style>
