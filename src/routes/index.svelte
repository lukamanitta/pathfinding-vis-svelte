<script lang="ts">
  import PathfindingVisualiser from '$lib/components/PathfindingVisualiser/PathfindingVisualiser.svelte';
</script>

<div id="visualiser">
  <PathfindingVisualiser />
</div>

<style lang="scss">
  #visualiser {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
</style>
