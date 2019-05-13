<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let parameter = "";
  export let stepSize = 1;
  export let min = 0;
  export let max = 100;
  export let metaStep = 1;

  function animate() {
    dispatch("animate", {
      parameter,
      stepSize
    });
  }
</script>


<div class="animation">
  <button on:click={animate}>{parameter}</button>
  <p>value: {stepSize}</p>
  <label for="{parameter}">
    <input type="range"  min="{min}" max="{max}" step="{metaStep}" bind:value={stepSize}>
  </label>
</div>
