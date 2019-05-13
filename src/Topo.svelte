<script>
// cloth seems to be hanging. why is the animation loop not drawing?
// - test it with drawing a constant shape.
  import { onMount } from 'svelte';
  import Konva from 'konva';
  import perlin from './perlin';

  import Animate from './Animate.svelte';

  export let name;

  // Parameters
  let parameters = {
    noiseScaleX : 70,
    noiseScaleY : 70,
    xnoff : 0.0015, // diff between lines
    ynoff : 0.020,  // diff between points
    xdetail : 40, //default 640
    ydetail : 40, //default 640
  }

  let dimensions = {width: 100, height: 100};
  let layer;

  let animations = [];

  function rebuild() {
    /* const newPaths = build(dimensions, parameters); */
    layer.destroyChildren();
    topo(layer);
  }

  let animationSeconds = 1;
  function animatee({detail: {parameter, stepSize}}) {
    const frames = animationSeconds * 30;
    animations.push({parameter: parameter, stepSize, duration: frames});
  }

  const ranges = [
    {min: 0.33, max: 0.35, color: '#333'},
    {min: 0.53, max: 0.55, color: '#888'},
    {min: 0.73, max: 0.75, color: '#BBB'}
  ];

  function topo(layer) {
    const points = [];
    for (let x = 0; x < dimensions.width; x++) {
      for (let y = 0; y < dimensions.height; y++) {

        let noise = perlin(x * 0.05, y * 0.05) ;
        /* console.log(`${noise}`); */
        ranges.forEach( ({min, max, color}) => {
          if (noise > min && noise < max) points.push({x,y,color});
        });
      }
    }
    points.forEach( ({x,y, color}) => {
      layer.add(new Konva.Circle({
        x,
        y,
        radius: 0.2,
        fill: color
      }));
    });

    layer.draw();

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
    /* let paths = build(dimensions, parameters); */
    /* cloth(layer, paths); */
    topo(layer);

    // draw the image
    /* layer.draw(); */
    console.log("hi");

    let frame;

    (function loop() {
      frame = requestAnimationFrame(loop);

      animations.forEach(a => {
        if (a.duration > 0) {
          parameters[a.parameter] += a.stepSize;
          a.duration -= 1;
          rebuild();
        }
      });
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
  #my-app {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;

    width: 95%;
    margin: 0 auto;
  }

  #left-half {

  }
</style>

<div id="my-app">

  <div id="left-half">
    {#each ranges as {min, max}, i}
      <div>
        min: <input type="range" min="0" max="1" step="0.01" bind:value={min} on:mouseup={rebuild}>
        max: <input type="range" min="0" max="1" step="0.01" bind:value={max} on:mouseup={rebuild}>
      </div>
    {/each}

    </div>
    <div id="right-half">
      <h1>Cloth</h1>
      <div id="my-stage"></div>
    </div>
</div>
