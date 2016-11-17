var fragSrc = require('./shaders/frag.glsl');
var vertSrc = require('./shaders/vert.glsl');

var chunk = require('./chunk.js');

var attrib = require('./attrib.js');

var vec = require('./vector.js');
var mat = require('./matrix.js');
var cam = require('./camera.js');

var mat4 = mat.mat4;
var vec3 = vec.vec3;


var gl, program, canvas;
var colors, blocks;

var voxels = chunk.create();


//Initialize shaders and draw surface
var setup = function(){
  //Generate voxel values
  for (var i = 0; i < voxels.length; i++){
    voxels[i] = Math.random()*1.4|0;
  }

  //TODO: find a better voxel polygonization method (0fps.net)
  blocks = chunk.cullMesh(voxels);
  colors = new Uint8Array(blocks.length);

  for (i = 0; i < colors.length; i+=3){
      var r = Math.sin(blocks[i]) + Math.sin(blocks[i+1]) + Math.sin(blocks[i+2]);
      colors[i+0] = r * 107;
      colors[i+1] = r * 103;
      colors[i+2] = r * 101;
  }


  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  //Create shaders
  var fragment = gl.createShader(gl.FRAGMENT_SHADER);
  var vertex = gl.createShader(gl.VERTEX_SHADER);

  //load the source code
  gl.shaderSource(fragment, fragSrc);
  gl.shaderSource(vertex, vertSrc);


  //Compile 'em!
  gl.compileShader(vertex);
  if(!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
      console.log('Vertex error:\\n' + gl.getShaderInfoLog(vertex));
      return;
  }

  gl.compileShader(fragment);
  if(!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
      console.log('Fragment error:\\n' + gl.getShaderInfoLog(fragment));
      return;
  }

  //Link the shaders into a program
  program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.useProgram(program);

  //Check for errors
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log('Linking Error:\\n' + gl.getProgramInfoLog(program));
      return;
  }

  //Init colors
  attrib.create(gl, gl.STATIC_DRAW, colors);
  attrib.enable(gl, program, gl.UNSIGNED_BYTE, 'a_color', true);

  //Init vertices
  attrib.create(gl, gl.STATIC_DRAW, blocks);
  attrib.enable(gl, program, gl.FLOAT, 'a_position', false);
};

var camp = vec3.create();
var objp = vec3.create();

var projMat = mat4.create();
var cameraMat = mat4.create();
var viewMat = mat4.create();
var viewProjMat = mat4.create();

//Draw routine
var display = function(time){
  // Clear the canvas.
  gl.clearColor(0.2,0.0,0.05,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //Update uniform values here if necessary

  cam.perspective(projMat, 1.2, canvas.width/canvas.height, 1, 1000);

  vec3.assignFromArgs(camp, 15*Math.cos(time/600) + chunk.CHUNK_WIDTH/2,
                            chunk.CHUNK_HEIGHT / 2,
                            15*Math.sin(time/600) + chunk.CHUNK_DEPTH/2);

  vec3.assignFromArgs(objp, chunk.CHUNK_WIDTH / 2,
                            chunk.CHUNK_HEIGHT / 2,
                            chunk.CHUNK_DEPTH / 2);

  cam.lookAt(cameraMat, camp, objp);

  mat4.inverse(viewMat, cameraMat);
  mat4.multiply(viewProjMat, projMat, viewMat);

  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  gl.uniformMatrix4fv(matrixLocation, 0, viewProjMat);

  gl.drawArrays(gl.TRIANGLES, 0, blocks.length / 3);

  window.requestAnimationFrame(display);
};



window.addEventListener('load', function(){
  canvas = document.createElement('canvas');

  canvas.width = 800;
  canvas.height = 640;

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
