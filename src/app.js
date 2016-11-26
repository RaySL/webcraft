var fragSrc = require('./shaders/frag.glsl');
var vertSrc = require('./shaders/vert.glsl');

//var chunk = require('./chunk.js');
var chunkset = require('./chunkset.js');

var attrib = require('./attrib.js');
var shader = require('./shader.js');

var vec = require('./vector.js');
var mat = require('./matrix.js');
var cam = require('./camera.js');

var mat4 = mat.mat4;
var vec3 = vec.vec3;
var vec4 = vec.vec4;


var gl, program, canvas;
var colors, blocks;

var cs = chunkset.create();

//var voxels = chunk.create();


//Initialize shaders and draw surface
var setup = function(){
  /*
  var cblocks;
  var ccolors;
  var ablocks = [];
  var acolors = [];
  var len = 0;
  for (var x = 0; x < 5; x++){
    //Generate voxel values
    for (var i = 0; i < voxels.length; i++){
      voxels[i] = (0.2 + Math.random()) | 0;
    }

    //TODO: find a better voxel polygonization method (0fps.net)
    cblocks = chunk.cullMeshWithOffset(voxels, vec3.createFromArgs(x*chunk.CHUNK_WIDTH, 0, 0));
    ccolors = new Uint8Array(cblocks.length);

    for (i = 0; i < ccolors.length; i+=3){
        ccolors[i+0] = Math.random()*255;//sin(blocks[i]*0.2) * 127;
        ccolors[i+1] = Math.random()*255;//sin(blocks[i+1]*0.2) * 127;
        ccolors[i+2] = Math.random()*255;//sin(blocks[i+2]*0.2) * 127;
    }

    len += cblocks.length;

    ablocks.push(cblocks);
    acolors.push(ccolors);
  }

  blocks = new Float32Array(len);
  colors = new Uint8Array(len);
  console.log(len);
  var idx = 0;
  for (i = 0; i < ablocks.length; i++){
    blocks.set(ablocks[i], idx);
    colors.set(acolors[i], idx);
    idx += ablocks[i].length;
    console.log(idx);
  }

  /*blocks = new Float32Array();
  colors = [];
  for (i = 0; i < chunks.length; i++){
    blocks.concat
  }*/

  for (var i = 0; i < 1600; i++){
    var x = Math.random() - 0.5;
    var y = Math.random() - 0.5;
    var z = Math.random() - 0.5;

    if (x*x + y*y + z*z < 0.25){
      x = 32 + x * 32;
      y = 32 + y * 32;
      z = 32 + z * 32;

      x |= 0;
      y |= 0;
      z |= 0;
      //console.log(x, y, z);

      chunkset.setFromArgs(cs, x, y, z, 1);
    }
  }

  blocks = chunkset.cullMeshRangeArgs(cs, 0, 0, 0, 2, 2, 2);
  colors = new Uint8Array(blocks.length);
  console.log(blocks);

  for (i = 0; i < colors.length; i+=3){
      colors[i+0] = Math.random()*255;//sin(blocks[i]*0.2) * 127;
      colors[i+1] = 128;//Math.random()*255;//sin(blocks[i+1]*0.2) * 127;
      colors[i+2] = 128;//Math.random()*255;//sin(blocks[i+2]*0.2) * 127;
  }

  //Set the viewport
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  //Enable face culling
  gl.enable(gl.CULL_FACE);

  //Enable depth testing
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  //Create shaders
  var frag = shader.create(gl, fragSrc, gl.FRAGMENT_SHADER);
  var vert = shader.create(gl, vertSrc, gl.VERTEX_SHADER);

  //Create program
  program = shader.program(gl, frag, vert);

  //Init colors
  attrib.create(gl, gl.STATIC_DRAW, colors);
  attrib.enable(gl, program, gl.UNSIGNED_BYTE, 'a_color', true);

  //Init vertices
  attrib.create(gl, gl.STATIC_DRAW, blocks);
  attrib.enable(gl, program, gl.FLOAT, 'a_position', false);
};

var camp = vec3.create();
var objp = vec3.create();
var camt = mat4.create();

var projMat = mat4.create();
var cameraMat = mat4.create();
var viewMat = mat4.create();
var viewProjMat = mat4.create();

//Draw routine
var display = function(time){
  // Clear the canvas.
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //Update uniform values here if necessary

  //Camera position
  vec4.assignFromArgs(camp, 0, 0, 40, 1);

  //Rotate camera around origin with time
  mat4.rotateY(camt, time / 1000);
  vec4.matrixMultiply(camp, camp, camt);

  //Shift camera, so that the rotation is around the center of a chunk
  mat4.translation(camt, vec3.createFromArgs(32,//chunk.CHUNK_WIDTH / 2,
                                             32,//chunk.CHUNK_HEIGHT / 2,
                                             32));//chunk.CHUNK_DEPTH / 2));
  vec4.matrixMultiply(camp, camp, camt);

  //The point where the camera will point
  vec3.assignFromArgs(objp, 32, 32, 32);/*chunk.CHUNK_WIDTH / 2,
                            chunk.CHUNK_HEIGHT / 2,
                            chunk.CHUNK_DEPTH / 2);*/

  //Calculate the lookAt Matrix
  cam.lookAt(cameraMat, camp, objp);

  //turn the camera matrix into a view matrix
  mat4.inverse(viewMat, cameraMat);

  //Calculate the projection matrix, accounting for perspective
  cam.perspective(projMat, 1.2, canvas.width/canvas.height, 1, 1000);

  //Apply the view to the projection matrix
  mat4.multiply(viewProjMat, projMat, viewMat);

  //Assign the uniform for the view projection matrix
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  gl.uniformMatrix4fv(matrixLocation, 0, viewProjMat);

  //Draw
  gl.drawArrays(gl.TRIANGLES, 0, blocks.length / 3);

  //Loop at 60fps max
  window.requestAnimationFrame(display);
};



window.addEventListener('load', function(){
  canvas = document.createElement('canvas');

  var width = window.innerWidth
           || document.documentElement.clientWidth
           || document.body.clientWidth;

  var height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

  canvas.width = width;
  canvas.height = height;

  document.body.appendChild(canvas);

  var attr = {
    alpha: false,
    depth: true,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: true
  };

  gl = canvas.getContext('webgl', attr) ||
       canvas.getContext('experimental-webgl', attr);

  if (!gl){
    console.log('We\'re experiencing some technical difficulties.... WebGL is disabled');
    return;
  }

  setup();
  window.requestAnimationFrame(display);
});
