<script>
  import { onMount } from 'svelte';
  import Konva from 'konva';

  export let name;

  onMount(() => {
    const stage = new Konva.Stage({
      container: 'my-stage',
      width: 500,
      height: 500
    });

    const layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: 0,//stage.width() / 2,
      y: 0,//stage.height() / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4
    });

    // add the shape to the layer
    layer.add(circle);

    // add the layer to the stage
    stage.add(layer);

    // draw the image
    layer.draw();
    console.log("hi");
  });


</script>

<style>
  h1 {
    color: purple;
  }
  #my-stage {
    width: 500px;
    height: 500px;
  }
</style>

<div>
  <h1>Hello {name}!</h1>
  <canvas id="my-stage"
          bind:this={canvas}
  ></canvas>
</div>
