//TODO: Implement with Float32Array
//TODO: Consider hashing functions

function faces(values, width, height, depth){
  var vc = 0;
  var verts = [];

  var cx, cy, cz;

  for (var x = 0; x < width; x++)
  for (var y = 0; y < height; y++)
  for (var z = 0; z < depth; z++) {
    if (values[x + y*width + z*width*height]){
      if (x == 0 || values[x-1 + y*width + z*width*height] == 0){
        verts[vc++] = [ x,   y,   z   ];
        verts[vc++] = [ x,   y,   z+1 ];
        verts[vc++] = [ x,   y+1, z   ];
        verts[vc++] = [ x,   y+1, z+1 ];
        verts[vc++] = [ x,   y+1, z   ];
        verts[vc++] = [ x,   y,   z+1 ];
      }

      if (y == 0 || values[x + (y-1)*width + z*width*height] == 0){
        verts[vc++] = [ x,   y,   z   ];
        verts[vc++] = [ x+1, y,   z   ];
        verts[vc++] = [ x,   y,   z+1 ];
        verts[vc++] = [ x+1, y,   z+1 ];
        verts[vc++] = [ x,   y,   z+1 ];
        verts[vc++] = [ x+1, y,   z   ];
      }

      if (z == 0 || values[x + y*width + (z-1)*width*height] == 0){
        verts[vc++] = [ x,   y,   z   ];
        verts[vc++] = [ x,   y+1, z   ];
        verts[vc++] = [ x+1, y,   z   ];
        verts[vc++] = [ x+1, y+1, z   ];
        verts[vc++] = [ x+1, y,   z   ];
        verts[vc++] = [ x,   y+1, z   ];
      }

      if (x == width-1 || values[x+1 + y*width + z*width*height] == 0){
        verts[vc++] = [ x+1, y,   z   ];
        verts[vc++] = [ x+1, y+1, z   ];
        verts[vc++] = [ x+1, y,   z+1 ];
        verts[vc++] = [ x+1, y+1, z+1 ];
        verts[vc++] = [ x+1, y,   z+1 ];
        verts[vc++] = [ x+1, y+1, z   ];
      }

      if (y == height-1 || values[x + (y+1)*width + z*width*height] == 0){
        verts[vc++] = [ x,   y+1, z   ];
        verts[vc++] = [ x,   y+1, z+1 ];
        verts[vc++] = [ x+1, y+1, z   ];
        verts[vc++] = [ x+1, y+1, z+1 ];
        verts[vc++] = [ x+1, y+1, z   ];
        verts[vc++] = [ x,   y+1, z+1 ];
      }

      if (z == depth-1 || values[x + y*width + (z+1)*width*height] == 0){
        verts[vc++] = [ x,   y,   z+1 ];
        verts[vc++] = [ x+1, y,   z+1 ];
        verts[vc++] = [ x,   y+1, z+1 ];
        verts[vc++] = [ x+1, y+1, z+1 ];
        verts[vc++] = [ x,   y+1, z+1 ];
        verts[vc++] = [ x+1, y,   z+1 ];
      }
    }
  }

  console.log(verts.length / 6 + " faces in mesh");

  return verts;
}

module.exports = faces;
