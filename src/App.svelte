<script>
// cloth seems to be hanging. why is the animation loop not drawing?
// - test it with drawing a constant shape.
  import { onMount } from 'svelte';
  import Konva from 'konva';
  import { perlin2 } from './noise.js';
  import linspace from './linspace';


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
    const newPaths = build(dimensions);
    layer.destroyChildren();
    cloth(layer, newPaths);
  }

  function build ({width, height}) {
    let paths = [];
    let xlo = 1 * width / 4;
    let xhi = 3 * width / 4;
    let ylo = 1 * height / 4;
    let yhi = 3 * height / 4;

    let xset = linspace (xlo, xhi, xdetail);
    let yset = linspace (ylo, yhi, ydetail);

    //building paths
    for (let xiter = 0; xiter < xset.length; xiter++) {
      let path = [];
      for (let yiter = 0; yiter < yset.length; yiter++) {
        let xin = xset[xiter];
        let yin = yset[yiter];
        path.push ( { x: xin, y: yin } );
      }
      paths.push (path);
    }
    //hold original coordinates for each vector in each of s.paths path
    for (let eout of paths) {
      for (let ein of eout) {
        ein.ox = ein.x;
        ein.oy = ein.y;
        ein.x = ein.ox;
        ein.y = ein.oy;
        ein.x += perlin2(0 + (ein.ox * xnoff), 0 + (ein.oy * ynoff)) * noiseScaleX;
        ein.y += perlin2(0 + (ein.ox * xnoff), 0 + (ein.oy * ynoff)) * noiseScaleY;
      }
    }
    return paths;
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
    let paths = build(dimensions);
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
    <input type="range" min="1" max="200" step="1" bind:value={xnoff} on:mouseup={rebuild}>
  </label>
  <label for="">
    y noise offset:
    <input type="range" min="1" max="200" step="1" bind:value={ynoff} on:mouseup={rebuild}>
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
