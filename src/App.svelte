<script>
// cloth seems to be hanging. why is the animation loop not drawing?
// - test it with drawing a constant shape.
  import { onMount } from 'svelte';
  import Konva from 'konva';
  import build from './path';

  export let name;

  // Parameters
  let noiseScaleX = 70;
  let noiseScaleY = 70;
  let xnoff = 0.0015; // diff between lines
  let ynoff = 0.020;  // diff between points
  let xdetail = 40; //default 640
  let ydetail = 40; //default 640

  let dimensions = {width: 500, height: 500};
  let layer;

  function rebuild() {
    const newPaths = build(dimensions
                          ,noiseScaleX
                          ,noiseScaleY
                          ,xnoff
                          ,ynoff
                          ,xdetail
                          ,ydetail
                          );
    layer.destroyChildren();
    cloth(layer, newPaths);
  }


  function cloth (layer, paths) {
    console.time("cloth");
    for (let eout of paths) {
      const points = eout.flatMap(val => [val.x, val.y]);
      layer.add(new Konva.Line({
        points,
        stroke: '#777777',
        tension: 0.5
      }));
    }
    layer.draw();
    console.timeEnd("cloth");
  }

  let canvas;
  onMount(() => {
    const stage = new Konva.Stage({
      container: 'my-stage',
      width: 500,
      height: 500
    });

    layer = new Konva.Layer();

    // add the layer to the stage
    stage.add(layer);
    let paths = build(dimensions
                      ,noiseScaleX
                      ,noiseScaleY
                      ,xnoff
                      ,ynoff
                      ,xdetail
                      ,ydetail
                      );
    cloth(layer, paths);

    // draw the image
    /* layer.draw(); */
    console.log("hi");

    let frame;

    (function loop() {
      frame = requestAnimationFrame(loop);

      /* cloth(layer, paths); */
    }());

    return () => {
      cancelAnimationFrame(frame);
    };
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
  <h1>Cloth</h1>

  <label for="">
    x noise offset:
    <input type="range" min="0" max="0.1" step="0.0005" bind:value={xnoff} on:mouseup={rebuild}>
  </label>
  <label for="">
    y noise offset:
    <input type="range" min="0" max="0.1" step="0.0005" bind:value={ynoff} on:mouseup={rebuild}>
  </label>
  <label for="">
    x detail: number of paths
    <input type="range" min="1" max="200" step="1" bind:value={xdetail} on:mouseup={rebuild}>
  </label>
  <label for="">
    y detail: number of points for each path
    <input type="range" min="1" max="200" step="1" bind:value={ydetail} on:mouseup={rebuild}>
  </label>
  <label for="">
    noise scale X: perlin noise always returns a value between 0 and 1, so nscale brings that up to the desired amplitude to get a cloth-like effect
    <input type="range" min="0" max="100" step="0.5" bind:value={noiseScaleX} on:mouseup={rebuild}>
  </label>
  <label for="">
    noise scale Y: perlin noise always returns a value between 0 and 1, so nscale brings that up to the desired amplitude to get a cloth-like effect
    <input type="range" min="0" max="100" step="0.5" bind:value={noiseScaleY} on:mouseup={rebuild}>
  </label>
  <div id="my-stage"></div>
</div>
