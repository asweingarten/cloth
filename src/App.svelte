<script>
// cloth seems to be hanging. why is the animation loop not drawing?
// - test it with drawing a constant shape.
  import { onMount } from 'svelte';
  import Konva from 'konva';
  import { perlin2 } from './noise.js';
  import linspace from './linspace';


  export let name;

  function build ({width, height}) {
    let paths = [];
    let xnoff = 0.0015; // diff between lines
    let ynoff = 0.020;  // diff between points
    let nscale = 70;
    let xdetail = 640; //default 640
    let ydetail = 640; //default 640
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
        ein.x += perlin2(0 + (ein.ox * xnoff), 0 + (ein.oy * ynoff)) * nscale;
        ein.y += perlin2(0 + (ein.ox * xnoff), 0 + (ein.oy * ynoff)) * nscale;
      }
    }
    return paths;
  }

  function cloth (layer, paths) {
  //drawing
    console.time("cloth");
    /* let xnoff = 0.0015; // diff between lines */
    /* let ynoff = 0.020;  // diff between points */
    /* let nscale = 70; */
    for (let eout of paths) {
      /* for (let ein of eout) { */
      /*   ein.x = ein.ox; */
      /*   ein.y = ein.oy; */
      /*   ein.x += perlin2(0 + (ein.ox * xnoff), 0 + (ein.oy * ynoff)) * nscale; */
      /*   ein.y += perlin2(0 + (ein.ox * xnoff), 0 + (ein.oy * ynoff)) * nscale; */
      /* } */
      //drawPath (eout, false, p5.line);
      const points = eout.flatMap(val => [val.x, val.y]);
      layer.add(new Konva.Line({
        points,
        stroke: '#777777',
        tension: 1
      }));
      /* for (let iter = 0; iter < eout.length - 1; iter++) { */
      /*   let curr = eout[iter]; */
      /*   let next = eout[(iter + 1) % eout.length]; */

      /*   /1* p5.line (curr.x, curr.y, next.x, next.y); *1/ */
      /*   layer.add(new Konva.Line([curr.x, curr.y, next.x, next.y])); */
      /* } */
    }
    layer.draw();
    console.timeEnd("cloth");
  }

  let canvas;
  let layer;
  onMount(() => {
    const stage = new Konva.Stage({
      container: 'my-stage',
      width: 500,
      height: 500
    });

    layer = new Konva.Layer();

    // add the layer to the stage
    stage.add(layer);
    let paths = build( {width: 500, height: 500});
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
  <h1>Hello {name}!</h1>
  <div id="my-stage"></div>
<!--  <canvas id="my-stage"
          bind:this={canvas}
  ></canvas> -->
</div>
