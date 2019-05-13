<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let parameter = "";
  export let stepSize = 1;

  function animate() {
    dispatch("animate", {
      parameter,
      stepSize
    });
  }
</script>


<div class="animation">
  <button on:click={animate}>{parameter}</button>
</div>
