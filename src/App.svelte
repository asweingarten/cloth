<script>
// cloth seems to be hanging. why is the animation loop not drawing?
// - test it with drawing a constant shape.
  import { onMount } from 'svelte';
  import Konva from 'konva';
  import build from './path';

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

  let dimensions = {width: 500, height: 500};
  let layer;

  let animations = [];

  function rebuild() {
    const newPaths = build(dimensions, parameters);
    layer.destroyChildren();
    cloth(layer, newPaths);
  }

  let animationSeconds = 1;
  function animatee({detail: {parameter, stepSize}}) {
    const frames = animationSeconds * 30;
    animations.push({parameter: parameter, stepSize, duration: frames});
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
    let paths = build(dimensions, parameters);
    cloth(layer, paths);

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
</style>

<div>
  <h1>Cloth</h1>

  <h3>Animations</h3>
  <label for="">
    Animation Duration:
    <input type="range" min="1" max="10" step="0.5" bind:value={animationSeconds} on:mouseup={rebuild}>
  </label>
  <Animate parameter="xnoff" stepSize="{0.000005}" on:animate="{animatee}"></Animate>
  <Animate parameter="ynoff" stepSize="{0.000005}" on:animate="{animatee}"></Animate>
  <Animate parameter="xdetail" stepSize="{1}" on:animate="{animatee}"></Animate>
  <Animate parameter="ydetail" stepSize="{1}" on:animate="{animatee}"></Animate>
  <Animate parameter="ydetail" stepSize="{1}" on:animate="{animatee}"></Animate>
  <Animate parameter="noiseScaleX" stepSize="{0.5}" on:animate="{animatee}"></Animate>
  <Animate parameter="noiseScaleY" stepSize="{0.5}" on:animate="{animatee}"></Animate>

  <label for="">
    x noise offset:
    <input type="range" min="0" max="0.1" step="0.0005" bind:value={parameters.xnoff} on:mouseup={rebuild}>
  </label>
  <label for="">
    y noise offset:
    <input type="range" min="0" max="0.1" step="0.0005" bind:value={parameters.ynoff} on:mouseup={rebuild}>
  </label>
  <label for="">
    x detail: number of paths
    <input type="range" min="1" max="200" step="1" bind:value={parameters.xdetail} on:mouseup={rebuild}>
  </label>
  <label for="">
    y detail: number of points for each path
    <input type="range" min="1" max="200" step="1" bind:value={parameters.ydetail} on:mouseup={rebuild}>
  </label>
  <label for="">
    noise scale X: perlin noise always returns a value between 0 and 1, so nscale brings that up to the desired amplitude to get a cloth-like effect
    <input type="range" min="0" max="100" step="0.5" bind:value={parameters.noiseScaleX} on:mouseup={rebuild}>
  </label>
  <label for="">
    noise scale Y: perlin noise always returns a value between 0 and 1, so nscale brings that up to the desired amplitude to get a cloth-like effect
    <input type="range" min="0" max="100" step="0.5" bind:value={parameters.noiseScaleY} on:mouseup={rebuild}>
  </label>
  <div id="my-stage"></div>
</div>
