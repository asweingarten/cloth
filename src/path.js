import linspace from './linspace.js';
import { perlin2 } from './noise.js';

function build ({width, height}
                , { noiseScaleX
                  , noiseScaleY
                  , xnoff
                  , ynoff
                  , xdetail
                  , ydetail
                  }
  ) {
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

export default build;
