//var mesh = require('./mesh.js');

var chunk = {};

var CHUNK_WIDTH = 10;
var CHUNK_HEIGHT = 10;
var CHUNK_DEPTH = 10;

chunk.CHUNK_WIDTH = CHUNK_WIDTH;
chunk.CHUNK_HEIGHT = CHUNK_HEIGHT;
chunk.CHUNK_DEPTH = CHUNK_DEPTH;






chunk.create = function(){
  return new Uint8Array(CHUNK_WIDTH * CHUNK_HEIGHT * CHUNK_DEPTH);
};

chunk.indexByArgs = function(c, x, y, z){
  return c[x + CHUNK_WIDTH * (y + CHUNK_HEIGHT * z)];
};
chunk.indexByVec = function(c, v){
  return c[v[0] + CHUNK_WIDTH * (v[1] + CHUNK_HEIGHT * v[2])];
};

/**
  Warning: chunk.cullMesh is only a proof of concept, and is extremely unoptimized!
**/

(function(){

  var maxfaces = CHUNK_WIDTH * CHUNK_HEIGHT * (CHUNK_DEPTH+1) +
                  CHUNK_WIDTH * (CHUNK_HEIGHT+1) * CHUNK_DEPTH +
                  (CHUNK_WIDTH+1) * CHUNK_HEIGHT * CHUNK_DEPTH;

  var verts = new Float32Array(maxfaces * 6 * 3);

  chunk.cullMesh = function(c){
    var vc = 0;
    verts.fill(0);

    for (var x = 0; x < CHUNK_WIDTH; x++)
    for (var y = 0; y < CHUNK_HEIGHT; y++)
    for (var z = 0; z < CHUNK_DEPTH; z++) {
      if (c[x + y*CHUNK_WIDTH + z*CHUNK_WIDTH*CHUNK_HEIGHT]){
        if (x == 0 || c[x-1 + y*CHUNK_WIDTH + z*CHUNK_WIDTH*CHUNK_HEIGHT] == 0){
          verts.set([ x,   y,   z,
                      x,   y,   z+1,
                      x,   y+1, z,
                      x,   y+1, z+1,
                      x,   y+1, z,
                      x,   y,   z+1], vc);
          vc += 18;
        }

        if (y == 0 || c[x + (y-1)*CHUNK_WIDTH + z*CHUNK_WIDTH*CHUNK_HEIGHT] == 0){
          verts.set([ x,   y,   z,
                      x+1, y,   z,
                      x,   y,   z+1,
                      x+1, y,   z+1,
                      x,   y,   z+1,
                      x+1, y,   z], vc);
          vc += 18;
        }

        if (z == 0 || c[x + y*CHUNK_WIDTH + (z-1)*CHUNK_WIDTH*CHUNK_HEIGHT] == 0){
          verts.set([ x,   y,   z,
                      x,   y+1, z,
                      x+1, y,   z,
                      x+1, y+1, z,
                      x+1, y,   z,
                      x,   y+1, z], vc);
          vc += 18;
        }

        if (x == CHUNK_WIDTH-1 || c[x+1 + y*CHUNK_WIDTH + z*CHUNK_WIDTH*CHUNK_HEIGHT] == 0){
          verts.set([ x+1, y,   z,
                      x+1, y+1, z,
                      x+1, y,   z+1,
                      x+1, y+1, z+1,
                      x+1, y,   z+1,
                      x+1, y+1, z], vc);
          vc += 18;
        }

        if (y == CHUNK_HEIGHT-1 || c[x + (y+1)*CHUNK_WIDTH + z*CHUNK_WIDTH*CHUNK_HEIGHT] == 0){
          verts.set([ x,   y+1, z,
                      x,   y+1, z+1,
                      x+1, y+1, z,
                      x+1, y+1, z+1,
                      x+1, y+1, z,
                      x,   y+1, z+1], vc);
          vc += 18;
        }

        if (z == CHUNK_DEPTH-1 || c[x + y*CHUNK_WIDTH + (z+1)*CHUNK_WIDTH*CHUNK_HEIGHT] == 0){
          verts.set([ x,   y,   z+1,
                      x+1, y,   z+1,
                      x,   y+1, z+1,
                      x+1, y+1, z+1,
                      x,   y+1, z+1,
                      x+1, y,   z+1], vc);
          vc += 18;
        }
      }
    }

    return verts.slice(0, vc);
  };

})();


module.exports = chunk;
