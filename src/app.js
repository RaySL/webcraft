var fragSrc = require('./shaders/frag.glsl');
var vertSrc = require('./shaders/vert.glsl');

//var marchingcubes = require('./marchingcubes.js');
var faces = require('./voxelpoly.js')
var Mat4 = require('./matrix4.js');


var gl, program, canvas;
var meshverts, meshcolors;

var isofunction = function(x, y, z) {
    var a = 9 / (x * x + y * y * 0.05 + z * z);
    var b = 9 / (x * x * 0.05 + y * y + z * z);
    var c = 9 / (x * x + y * y + z * z * 0.05);
    return Math.sqrt(a*a+b*b+c*c) - 1;
};

var vox = [
  1,1,1,
  1,1,1,
  1,1,1,

  1,1,1,
  1,1,1,
  1,1,1,

  1,1,1,
  1,1,1,
  1,1,1
];


//Initialize shaders and draw surface
var setup = function(){
  var v = faces(vox, 3, 3, 3);
  var vo = [];
  for (var i = 0; i < v.length; i++){
    vo[i*3+0] = v[i][0];
    vo[i*3+1] = v[i][1];
    vo[i*3+2] = v[i][2];
  }
  meshverts = new Float32Array(vo);
  //meshverts = new Float32Array(marchingcubes(isofunction, -16, -16, -16, 16, 16, 16));

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

//Draw routine
var display = function(time){
  // Clear the canvas.
  gl.clearColor(0.4,0.0,0.1,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //Update uniform values
  //var uniformLocation = gl.getUniformLocation(program, 'time');
  //gl.uniform1f(uniformLocation, time/1000);

  //var uniformLocation = gl.getUniformLocation(program, 'res');
  //gl.uniform2f(uniformLocation, width, height);

  var projMat = Mat4.perspective(1, canvas.width/canvas.height, 1, 1e3);

  var cameraMat = Mat4.zRotation(time / 1000);
  cameraMat = Mat4.multiply(cameraMat, Mat4.yRotation(time / 1190));
  cameraMat = Mat4.multiply(cameraMat, Mat4.xRotation(time / 1310));
  cameraMat = Mat4.multiply(cameraMat, Mat4.translation(0, 0, 10));

  var viewMat = Mat4.inverse(cameraMat);
  var viewProjMat = Mat4.multiply(projMat, viewMat);

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
    console.log('We\'re experiencing some technical difficulties.... Please enable WebGL');
    return;
  }

  setup();
  window.requestAnimationFrame(display);
});
