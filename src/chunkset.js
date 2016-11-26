var chunk = require('./chunk.js');

/*
var CHUNK_SHIFT_X = 5;
var CHUNK_SHIFT_Y = 5;
var CHUNK_SHIFT_Z = 5;

var CHUNK_WIDTH  = 1 << CHUNK_SHIFT_X;
var CHUNK_HEIGHT = 1 << CHUNK_SHIFT_Y;
var CHUNK_DEPTH  = 1 << CHUNK_SHIFT_Z;

var CHUNK_MASK_X = CHUNK_WIDTH  - 1;
var CHUNK_MASK_Y = CHUNK_HEIGHT - 1;
var CHUNK_MASK_Z = CHUNK_DEPTH  - 1;

var CHUNK_SIZE = CHUNK_WIDTH * CHUNK_HEIGHT * CHUNK_DEPTH;

function hash(x, y, z){
  x &= 0x3FF;
  x  = (x | (x<<16)) & 0xFF0000FF;
  x  = (x | (x<<8))  & 0x0F00F00F;
  x  = (x | (x<<4))  & 0xC30C30C3;
  x  = (x | (x<<2))  & 0x49249249;

  y &= 0x3FF;
  y  = (y | (y<<16)) & 0xFF0000FF;
  y  = (y | (y<<8))  & 0x0F00F00F;
  y  = (y | (y<<4))  & 0xC30C30C3;
  y  = (y | (y<<2))  & 0x49249249;

  z &= 0x3FF;
  z  = (z | (z<<16)) & 0xFF0000FF;
  z  = (z | (z<<8))  & 0x0F00F00F;
  z  = (z | (z<<4))  & 0xC30C30C3;
  z  = (z | (z<<2))  & 0x49249249;

  return x + (y + (z << 1) << 1);
}


var world = {};

world.create = function(){
  return [];
};

world.get = function(w, x, y, z){
  var chunk = w[hash(x >> CHUNK_SHIFT_X,
                     y >> CHUNK_SHIFT_Y,
                     z >> CHUNK_SHIFT_Z)];

  return chunk ? chunk[
      (x & CHUNK_MASK_X) +
      ((y & CHUNK_MASK_Y) +
      ((z & CHUNK_MASK_Z) << CHUNK_SHIFT_Y) << CHUNK_SHIFT_X)
  ] : 0;
};

world.set = function(w, x, y, z, v){
  var k = hash(x >> CHUNK_SHIFT_X, y >> CHUNK_SHIFT_Y, z >> CHUNK_SHIFT_Z);
  var chunk = w[k];
  if (!chunk){
    w[k] = new Uint8Array(CHUNK_SIZE);
  }
  chunk[
      (x & CHUNK_MASK_X) +
      ((y & CHUNK_MASK_Y) +
      ((z & CHUNK_MASK_Z) << CHUNK_SHIFT_Y) << CHUNK_SHIFT_X)
  ] = v;
};
*/

function hash(x, y, z){
  x &= 0x3FF;
  x  = (x | (x<<16)) & 0xFF0000FF;
  x  = (x | (x<<8))  & 0x0F00F00F;
  x  = (x | (x<<4))  & 0xC30C30C3;
  x  = (x | (x<<2))  & 0x49249249;

  y &= 0x3FF;
  y  = (y | (y<<16)) & 0xFF0000FF;
  y  = (y | (y<<8))  & 0x0F00F00F;
  y  = (y | (y<<4))  & 0xC30C30C3;
  y  = (y | (y<<2))  & 0x49249249;

  z &= 0x3FF;
  z  = (z | (z<<16)) & 0xFF0000FF;
  z  = (z | (z<<8))  & 0x0F00F00F;
  z  = (z | (z<<4))  & 0xC30C30C3;
  z  = (z | (z<<2))  & 0x49249249;

  return x + (y + (z << 1) << 1);
}

var chunkset = {};

chunkset.create = function(){
  return [];
};

chunkset.getFromArgs = function(cs, x, y, z){
  var cx = x >> chunk.CHUNK_SHIFT_X,
      cy = y >> chunk.CHUNK_SHIFT_Y,
      cz = z >> chunk.CHUNK_SHIFT_Z,
      sx = x & chunk.CHUNK_MASK_X,
      sy = y & chunk.CHUNK_MASK_Y,
      sz = z & chunk.CHUNK_MASK_Z,
      c = cs[hash(cx, cy, cz)];



  if (c){
    return c[sx + chunk.CHUNK_WIDTH * (sy + chunk.CHUNK_HEIGHT * sz)];
  }

  return 0;
};
chunkset.setFromArgs = function(cs, x, y, z, v){
  var cx = x >> chunk.CHUNK_SHIFT_X,
      cy = y >> chunk.CHUNK_SHIFT_Y,
      cz = z >> chunk.CHUNK_SHIFT_Z,
      sx = x & chunk.CHUNK_MASK_X,
      sy = y & chunk.CHUNK_MASK_Y,
      sz = z & chunk.CHUNK_MASK_Z,
      h = hash(cx, cy, cz),
      c = cs[h];

  if (!c){
    //console.log("creating " + c + " at: <" + cx + ", " + cy + ", " + cz + ">, hash: " + h);
    c = cs[h] = chunk.create();
    //c = cs[h];
  }

  c[sx + chunk.CHUNK_WIDTH * (sy + chunk.CHUNK_HEIGHT * sz)] = v;
};

chunkset.cullMeshRangeArgs = function(cs, x, y, z, w, h, d){
  var meshes = [];
  var ml = 0;

  for (var ox = 0; ox < w; ox++){
  for (var oy = 0; oy < h; oy++){
  for (var oz = 0; oz < d; oz++){
    var c = cs[hash(x+ox, y+oy, z+oz)];
    if (c){
      console.log("meshing chunk at: [", ox, oy, oz, "]");
      meshes[ml++] = chunk.cullMeshWithOffset(c, [(x+ox)*chunk.CHUNK_WIDTH, (y+oy)*chunk.CHUNK_HEIGHT, (z+oz)*chunk.CHUNK_DEPTH]);
    }
  }}}

  var l = 0;
  for (var i = 0; i < ml; i++){
    l += meshes[i].length;
  }

  var mesh = new Float32Array(l);
  l = 0;
  for (i = 0; i < ml; i++){
    mesh.set(meshes[i], l);
    l += meshes[i].length;
  }

  return mesh;
};




module.exports = chunkset;
