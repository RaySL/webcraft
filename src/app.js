var fragSrc = require('./shaders/frag.glsl');
var vertSrc = require('./shaders/vert.glsl');

//var marchingcubes = require('./marchingcubes.js');
var faces = require('./voxelpoly.js');

var vec = require('./vector.js');
var mat = require('./matrix.js');
var cam = require('./camera.js');

var mat4 = mat.mat4;
var vec3 = vec.vec3;



var gl, program, canvas;
var meshverts, meshcolors;

var cameraPos = [0, 0, 15];

var vox = [
  1,1,1,1,1,
  1,0,1,0,1,
  1,1,1,1,1,
  1,0,1,0,1,
  1,1,1,1,1,

  1,0,1,0,1,
  0,0,0,0,0,
  1,0,1,0,1,
  0,0,0,0,0,
  1,0,1,0,1,

  1,1,1,1,1,
  1,0,1,0,1,
  1,1,1,1,1,
  1,0,1,0,1,
  1,1,1,1,1,

  1,0,1,0,1,
  0,0,0,0,0,
  1,0,1,0,1,
  0,0,0,0,0,
  1,0,1,0,1,

  1,1,1,1,1,
  1,0,1,0,1,
  1,1,1,1,1,
  1,0,1,0,1,
  1,1,1,1,1
];

var vwidth = 10;
var vheight = 10;
var vdepth = 10;

for (var i = 0; i < vwidth*vheight*vdepth; i++){
  vox[i] = Math.random()*1.4|0;
}


//Initialize shaders and draw surface
var setup = function(){
  var v = faces(vox, vwidth, vheight, vdepth);
  var vo = [];
  for (var i = 0; i < v.length; i++){
    vo[i*3+0] = v[i][0];
    vo[i*3+1] = v[i][1];
    vo[i*3+2] = v[i][2];
  }

  meshverts = new Float32Array(vo);
  meshcolors = new Uint8Array(meshverts);

  for (var i = 0; i < meshcolors.length; i+=3){
      var m = Math.sin(0.8*(meshverts[i] + meshverts[i+1] + meshverts[i+2]));
      meshcolors[i+0] = (Math.sin(meshverts[i+0] + 2.094)*m*4 + 4) << 5;
      meshcolors[i+1] = (Math.sin(meshverts[i+1] + 0.000)*m*4 + 4) << 5;
      meshcolors[i+2] = (Math.sin(meshverts[i+2] + 4.189)*m*4 + 4) << 5;
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  //gl.viewport(0, 0, width, height);

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
      console.log('Vertex error:\n' + gl.getShaderInfoLog(vertex));
      return;
  }

  gl.compileShader(fragment);
  if(!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
      console.log('Fragment error:\n' + gl.getShaderInfoLog(fragment));
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
      console.log('Linking Error:\n' + gl.getProgramInfoLog(program));
      return;
  }


  //Load colors
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, meshcolors, gl.STATIC_DRAW);

  //Enable Color attribute
  var colorLocation = gl.getAttribLocation(program, 'a_color');
  gl.enableVertexAttribArray(colorLocation);
  gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

  //Load vertices
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, meshverts, gl.STATIC_DRAW);

  //Enable Vertex attribute
  var positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
};

var camp = vec3.create();
var objp = vec3.create();

var tmat = mat4.create();
var projMat = mat4.create();
var cameraMat = mat4.create();
var viewMat = mat4.create();
var viewProjMat = mat4.create();

//Draw routine
var display = function(time){
  // Clear the canvas.
  gl.clearColor(0.2,0.0,0.05,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //Update uniform values
  //var uniformLocation = gl.getUniformLocation(program, 'time');
  //gl.uniform1f(uniformLocation, time/1000);

  //var uniformLocation = gl.getUniformLocation(program, 'res');
  //gl.uniform2f(uniformLocation, width, height);

  cam.perspective(projMat, 1.2, canvas.width/canvas.height, 1, 1000)

  vec3.assignFromArgs(camp, 15*Math.cos(time/600) + vwidth/2, vheight / 2, 15*Math.sin(time/600) + vdepth/2);
  vec3.assignFromArgs(objp, vwidth / 2, vheight / 2, vdepth / 2);
  cam.lookAt(cameraMat, camp, objp);

  mat4.inverse(viewMat, cameraMat);
  mat4.multiply(viewProjMat, projMat, viewMat);

  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  gl.uniformMatrix4fv(matrixLocation, 0, viewProjMat);

  gl.drawArrays(gl.TRIANGLES, 0, meshverts.length / 3);

  window.requestAnimationFrame(display);
};



window.addEventListener('load', function(){
  canvas = document.createElement('canvas');

  canvas.width = 400;
  canvas.height = 400;

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

var step = 0.3;
window.addEventListener('keydown', function(event){
  if (event.keyCode == 39){
    cameraPos[0] += step;
  }
  if (event.keyCode == 37){
    cameraPos[0] -= step;
  }
  if (event.keyCode == 81){
    cameraPos[1] += step;
  }
  if (event.keyCode == 69){
    cameraPos[1] -= step;
  }
  if (event.keyCode == 40){
    cameraPos[2] += step;
  }
  if (event.keyCode == 38){
    cameraPos[2] -= step;
  }
})
