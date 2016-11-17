/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var fragSrc = __webpack_require__(3);
	var vertSrc = __webpack_require__(4);

	var chunk = __webpack_require__(7);

	var attrib = __webpack_require__(5);
	var shader = __webpack_require__(8);

	var vec = __webpack_require__(2);
	var mat = __webpack_require__(1);
	var cam = __webpack_require__(6);

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

	  var frag = shader.create(gl, fragSrc, gl.FRAGMENT_SHADER);
	  var vert = shader.create(gl, vertSrc, gl.VERTEX_SHADER);

	  program = shader.program(gl, frag, vert);

	  //Create shaders
	  //var fragment = gl.createShader(gl.FRAGMENT_SHADER);
	  //var vertex = gl.createShader(gl.VERTEX_SHADER);

	  //load the source code
	  //gl.shaderSource(fragment, fragSrc);
	  //gl.shaderSource(vertex, vertSrc);


	  //Compile 'em!
	  //gl.compileShader(vertex);
	  //if(!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
	  //    console.log('Vertex error:\\n' + gl.getShaderInfoLog(vertex));
	  //    return;
	  //}

	  //gl.compileShader(fragment);
	  //if(!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
	  //    console.log('Fragment error:\\n' + gl.getShaderInfoLog(fragment));
	  //    return;
	  //}

	  //Link the shaders into a program
	  //program = gl.createProgram();
	  //gl.attachShader(program, vertex);
	  //gl.attachShader(program, fragment);
	  //gl.linkProgram(program);
	  //gl.useProgram(program);

	  //Check for errors
	  //if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	  //    console.log('Linking Error:\\n' + gl.getProgramInfoLog(program));
	  //    return;
	  //}

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	//TODO: Multiply vectors by matrices

	var mat2 = {};//TODO: Implement mat2
	var mat3 = {};//TODO: Implement mat3
	var mat4 = {};

	//TODO: consider a "zeros" method
	mat4.create = function(){
	  var m = new Float32Array(16);
	  m[0] = 1;
	  m[5] = 1;
	  m[10] = 1;
	  m[15] = 1;
	  return m;
	};
	mat4.createFromArray = function(arr){
	  return new Float32Array(arr.slice(0, 16));
	};
	mat4.createFromArgs = function(
	  m00, m10, m20, m30,
	  m01, m11, m21, m31,
	  m02, m12, m22, m32,
	  m03, m13, m23, m33
	){
	  return new Float32Array(
	    m00, m10, m20, m30,
	    m01, m11, m21, m31,
	    m02, m12, m22, m32,
	    m03, m13, m23, m33
	  );
	};
	mat4.createFromVecs = function(v1, v2, v3, v4){
	  return new Float32Array(
	    v1[0], v1[1], v1[2], v1[3],
	    v2[0], v2[1], v2[2], v2[3],
	    v3[0], v3[1], v3[2], v3[3],
	    v4[0], v4[1], v4[2], v4[3]
	  );
	};

	//TODO: assignFromArgs
	mat4.assignFromArray = function(out, arr){
	  out.set(arr);//TODO: replace with direct assignment
	};
	mat4.assignFromVecs = function(out, v1, v2, v3, v4){
	  out[0] = v1[0];  out[1] = v1[1];  out[2] = v1[2];  out[3] = v1[3];
	  out[4] = v2[0];  out[5] = v2[1];  out[6] = v2[2];  out[7] = v2[3];
	  out[8] = v3[0];  out[9] = v3[1];  out[10] = v3[2]; out[11] = v3[3];
	  out[12] = v4[0]; out[13] = v4[1]; out[14] = v4[2]; out[15] = v4[3];
	};

	mat4.multiply = function(out, a, b){
	  var a00=a[0*4+0],a01=a[0*4+1],a02=a[0*4+2],
	      a03=a[0*4+3],a10=a[1*4+0],a11=a[1*4+1],
	      a12=a[1*4+2],a13=a[1*4+3],a20=a[2*4+0],
	      a21=a[2*4+1],a22=a[2*4+2],a23=a[2*4+3],
	      a30=a[3*4+0],a31=a[3*4+1],a32=a[3*4+2],
	      a33=a[3*4+3],
	      b00=b[0*4+0],b01=b[0*4+1],b02=b[0*4+2],
	      b03=b[0*4+3],b10=b[1*4+0],b11=b[1*4+1],
	      b12=b[1*4+2],b13=b[1*4+3],b20=b[2*4+0],
	      b21=b[2*4+1],b22=b[2*4+2],b23=b[2*4+3],
	      b30=b[3*4+0],b31=b[3*4+1],b32=b[3*4+2],
	      b33=b[3*4+3];

	  out[0]  = b00*a00 + b01*a10 + b02*a20 + b03*a30;
	  out[1]  = b00*a01 + b01*a11 + b02*a21 + b03*a31;
	  out[2]  = b00*a02 + b01*a12 + b02*a22 + b03*a32;
	  out[3]  = b00*a03 + b01*a13 + b02*a23 + b03*a33;
	  out[4]  = b10*a00 + b11*a10 + b12*a20 + b13*a30;
	  out[5]  = b10*a01 + b11*a11 + b12*a21 + b13*a31;
	  out[6]  = b10*a02 + b11*a12 + b12*a22 + b13*a32;
	  out[7]  = b10*a03 + b11*a13 + b12*a23 + b13*a33;
	  out[8]  = b20*a00 + b21*a10 + b22*a20 + b23*a30;
	  out[9]  = b20*a01 + b21*a11 + b22*a21 + b23*a31;
	  out[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
	  out[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
	  out[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
	  out[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
	  out[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
	  out[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
	};
	mat4.inverse = function(out, a){
	  var m00 = a[0 * 4 + 0];
	  var m01 = a[0 * 4 + 1];
	  var m02 = a[0 * 4 + 2];
	  var m03 = a[0 * 4 + 3];
	  var m10 = a[1 * 4 + 0];
	  var m11 = a[1 * 4 + 1];
	  var m12 = a[1 * 4 + 2];
	  var m13 = a[1 * 4 + 3];
	  var m20 = a[2 * 4 + 0];
	  var m21 = a[2 * 4 + 1];
	  var m22 = a[2 * 4 + 2];
	  var m23 = a[2 * 4 + 3];
	  var m30 = a[3 * 4 + 0];
	  var m31 = a[3 * 4 + 1];
	  var m32 = a[3 * 4 + 2];
	  var m33 = a[3 * 4 + 3];
	  var tmp0  = m22 * m33;
	  var tmp1  = m32 * m23;
	  var tmp2  = m12 * m33;
	  var tmp3  = m32 * m13;
	  var tmp4  = m12 * m23;
	  var tmp5  = m22 * m13;
	  var tmp6  = m02 * m33;
	  var tmp7  = m32 * m03;
	  var tmp8  = m02 * m23;
	  var tmp9  = m22 * m03;
	  var tmp10 = m02 * m13;
	  var tmp11 = m12 * m03;
	  var tmp12 = m20 * m31;
	  var tmp13 = m30 * m21;
	  var tmp14 = m10 * m31;
	  var tmp15 = m30 * m11;
	  var tmp16 = m10 * m21;
	  var tmp17 = m20 * m11;
	  var tmp18 = m00 * m31;
	  var tmp19 = m30 * m01;
	  var tmp20 = m00 * m21;
	  var tmp21 = m20 * m01;
	  var tmp22 = m00 * m11;
	  var tmp23 = m10 * m01;

	  var t0 = ((tmp0 * m11 + tmp3 * m21 + tmp4 * m31) - (tmp1 * m11 + tmp2 * m21 + tmp5 * m31));
	  var t1 = ((tmp1 * m01 + tmp6 * m21 + tmp9 * m31) - (tmp0 * m01 + tmp7 * m21 + tmp8 * m31));
	  var t2 = ((tmp2 * m01 + tmp7 * m11 + tmp10 * m31) - (tmp3 * m01 + tmp6 * m11 + tmp11 * m31));
	  var t3 = ((tmp5 * m01 + tmp8 * m11 + tmp11 * m21) - (tmp4 * m01 + tmp9 * m11 + tmp10 * m21));

	  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

	  out[0] = d * t0;
	  out[1] = d * t1;
	  out[2] = d * t2;
	  out[3] = d * t3;
	  out[4] = d * ((tmp1 * m10 + tmp2 * m20 + tmp5 * m30) - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30));
	  out[5] = d * ((tmp0 * m00 + tmp7 * m20 + tmp8 * m30) - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30));
	  out[6] = d * ((tmp3 * m00 + tmp6 * m10 + tmp11 * m30) - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30));
	  out[7] = d * ((tmp4 * m00 + tmp9 * m10 + tmp10 * m20) - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20));
	  out[8] = d * ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33));
	  out[9] = d * ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33));
	  out[10] = d * ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33));
	  out[11] = d * ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23));
	  out[12] = d * ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22));
	  out[13] = d * ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02));
	  out[14] = d * ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12));
	  out[15] = d * ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02));
	};

	mat4.translation = function(out, v){
	  out[0]  = 1;    out[1]  = 0;    out[2]  = 0;    out[3]  = 0;
	  out[4]  = 0;    out[5]  = 1;    out[6]  = 0;    out[7]  = 0;
	  out[8]  = 0;    out[9]  = 0;    out[10] = 1;    out[11] = 0;
	  out[12] = v[0]; out[13] = v[1]; out[14] = v[2]; out[15] = 1;
	};

	mat4.rotateX = function(out, ang){
	  var c = Math.cos(ang), s = Math.sin(ang);
	  out[0]  = 1;    out[1]  = 0;    out[2]  = 0;    out[3]  = 0;
	  out[4]  = 0;    out[5]  = c;    out[6]  = s;    out[7]  = 0;
	  out[8]  = 0;    out[9]  = -s;   out[10] = c;    out[11] = 0;
	  out[12] = 0;    out[13] = 0;    out[14] = 0;    out[15] = 1;
	};
	mat4.rotateY = function(out, ang){
	  var c = Math.cos(ang), s = Math.sin(ang);
	  out[0]  = c;    out[1]  = 0;    out[2]  = s;    out[3]  = 0;
	  out[4]  = 0;    out[5]  = 1;    out[6]  = 0;    out[7]  = 0;
	  out[8]  = -s;   out[9]  = 0;    out[10] = c;    out[11] = 0;
	  out[12] = 0;    out[13] = 0;    out[14] = 0;    out[15] = 1;
	};
	mat4.rotateZ = function(out, ang){
	  var c = Math.cos(ang), s = Math.sin(ang);
	  out[0]  = c;    out[1]  = s;    out[2]  = 0;    out[3]  = 0;
	  out[4]  = -s;   out[5]  = c;    out[6]  = 0;    out[7]  = 0;
	  out[8]  = 0;    out[9]  = 0;    out[10] = 1;    out[11] = 0;
	  out[12] = 0;    out[13] = 0;    out[14] = 0;    out[15] = 1;
	};

	mat4.scale = function(out, v){
	  out[0]  = v[0]; out[1]  = 0;    out[2]  = 0;    out[3]  = 0;
	  out[4]  = 0;    out[5]  = v[1]; out[6]  = 0;    out[7]  = 0;
	  out[8]  = 0;    out[9]  = 0;    out[10] = v[2]; out[11] = 0;
	  out[12] = 0;    out[13] = 0;    out[14] = 0;    out[15] = 1;
	};


	module.exports = {
	  mat2: mat2,
	  mat3: mat3,
	  mat4: mat4
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	var vec2 = {};

	vec2.create = function(){
	  return new Float32Array(4);
	};
	vec2.createFromArray = function(arr){
	  return new Float32Array([arr[0], arr[1], 0, 0]);
	};
	vec2.createFromArgs = function(x, y){
	  return new Float32Array([x, y, 0, 0]);
	};

	vec2.assignFromArray = function(out, arr){
	  out[0] = arr[0];
	  out[1] = arr[1];
	};
	vec2.assignFromArgs = function(out, x, y){
	  out[0] = x;
	  out[1] = y;
	};

	vec2.toVec4 = function(inout){
	  inout[3] = 0;
	  inout[2] = 0;
	};
	vec2.toVec3 = function(inout){
	  inout[3] = 0;
	  inout[2] = 0;
	};

	vec2.multiply = function(out, a, b){
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	};
	vec2.divide = function(out, a, b){
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	};
	vec2.add = function(out, a, b){
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	};
	vec2.subtract = function(out, a, b){
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	};
	vec2.negate = function(out, a){
	  out[0] = -a[0];
	  out[1] = -a[1];
	};
	vec2.dot = function(a, b){
	  return a[0]*b[0] + a[1]*b[1];
	};
	vec2.magnitude2 = function(a){
	  var x = a[0], y = a[1];
	  return x*x + y*y;
	};
	vec2.magnitude = function(a){
	  var x = a[0], y = a[1];
	  return Math.sqrt(x*x + y*y);
	};
	vec2.normalize = function(out, a){
	  var x = a[0], y = a[1];
	  var l = 1.0 / Math.sqrt(x*x + y*y);

	  out[0] = x * l;
	  out[1] = y * l;
	};
	vec2.distance = function(a, b){
	  var x = a[0] - b[0],
	      y = a[1] - b[1];

	  return Math.sqrt(x*x + y*y);
	};

	vec2.I = vec2.createFromArgs(1, 0);
	vec2.J = vec2.createFromArgs(0, 1);


	var vec3 = {};

	vec3.create = function(){
	  return new Float32Array(4);
	};
	vec3.createFromArray = function(arr){
	  return new Float32Array([arr[0], arr[1], arr[2], 0]);
	};
	vec3.createFromArgs = function(x, y, z){
	  return new Float32Array([x, y, z, 0]);
	};

	vec3.assignFromArray = function(out, arr){
	  out[0] = arr[0];
	  out[1] = arr[1];
	  out[2] = arr[2];
	};
	vec3.assignFromArgs = function(out, x, y, z){
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	};

	vec3.toVec4 = function(inout){
	  inout[3] = 0;
	};
	vec3.toVec2 = function(inout){
	  inout[3] = 0;
	  inout[2] = 0;
	};

	vec3.multiply = function(out, a, b){
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  out[2] = a[2] * b[2];
	};
	vec3.divide = function(out, a, b){
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  out[2] = a[2] / b[2];
	};
	vec3.add = function(out, a, b){
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	};
	vec3.subtract = function(out, a, b){
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	};
	vec3.negate = function(out, a){
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	};

	vec3.dot = function(a, b){
	  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
	};
	vec3.cross = function(out, a, b){
	  out[0] = a[1] * b[2] - b[1] * a[2];
	  out[1] = a[2] * b[0] - b[2] * a[0];
	  out[2] = a[0] * b[1] - b[0] * a[1];
	};
	vec3.magnitude2 = function(a){
	  var x = a[0], y = a[1], z = a[2];
	  return x*x + y*y + z*z;
	};
	vec3.magnitude = function(a){
	  var x = a[0], y = a[1], z = a[2];
	  return Math.sqrt(x*x + y*y + z*z);
	};
	vec3.normalize = function(out, a){
	  var x = a[0], y = a[1], z = a[2];
	  var l = 1.0 / Math.sqrt(x*x + y*y + z*z);

	  out[0] = x * l;
	  out[1] = y * l;
	  out[2] = z * l;
	};
	vec3.distance = function(a, b){
	  var x = a[0] - b[0],
	      y = a[1] - b[1],
	      z = a[2] - b[2];

	  return Math.sqrt(x*x + y*y + z*z);
	};

	vec3.I = vec3.createFromArgs(1, 0, 0);
	vec3.J = vec3.createFromArgs(0, 1, 0);
	vec3.K = vec3.createFromArgs(0, 0, 1);

	vec3.RIGHT =   vec3.I;
	vec3.UP =      vec3.J;
	vec3.FORWARD = vec3.K;


	var vec4 = {};

	vec4.create = function(){
	  return new Float32Array(4);
	};
	vec4.createFromArray = function(arr){
	  return new Float32Array([arr[0], arr[1], arr[2], arr[3]]);
	};
	vec4.createFromArgs = function(x, y, z, w){
	  return new Float32Array([x, y, z, w]);
	};

	vec4.assignFromArray = function(out, arr){
	  out[0] = arr[0];
	  out[1] = arr[1];
	  out[2] = arr[2];
	  out[3] = arr[3];
	};
	vec4.assignFromArgs = function(out, x, y, z, w){
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  out[3] = w;
	};

	vec4.toVec3 = function(inout){
	  inout[3] = 0;
	};
	vec4.toVec2 = function(inout){
	  inout[3] = 0;
	  inout[2] = 0;
	};

	vec4.multiply = function(out, a, b){
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  out[2] = a[2] * b[2];
	  out[3] = a[3] * b[3];
	};
	vec4.divide = function(out, a, b){
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  out[2] = a[2] / b[2];
	  out[3] = a[3] / b[3];
	};
	vec4.add = function(out, a, b){
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	};
	vec4.subtract = function(out, a, b){
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	};
	vec4.dot = function(a, b){
	  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3];
	};
	vec4.magnitude2 = function(a){
	  var x = a[0], y = a[1], z = a[2], w = a[3];
	  return x*x + y*y + z*z + w*w;
	};
	vec4.magnitude = function(a){
	  var x = a[0], y = a[1], z = a[2], w = a[3];
	  return Math.sqrt(x*x + y*y + z*z + w*w);
	};
	vec4.normalize = function(out, a){
	  var x = a[0], y = a[1], z = a[2], w = a[3];
	  var l = 1.0 / Math.sqrt(x*x + y*y + z*z + w*w);

	  out[0] = x * l;
	  out[1] = y * l;
	  out[2] = z * l;
	  out[3] = w * l;
	};
	vec4.distance = function(a, b){
	  var x = a[0] - b[0],
	      y = a[1] - b[1],
	      z = a[2] - b[2],
	      w = a[3] - b[3];

	  return Math.sqrt(x*x + y*y + z*z + w*w);
	};

	vec4.I = vec4.createFromArgs(1, 0, 0, 0);
	vec4.J = vec4.createFromArgs(0, 1, 0, 0);
	vec4.K = vec4.createFromArgs(0, 0, 1, 0);
	vec4.H = vec4.createFromArgs(0, 0, 0, 1);


	module.exports = {
	  vec2: vec2,
	  vec3: vec3,
	  vec4: vec4
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "/*\nfrag.glsl\n*/\n\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 v_color;\n\nvoid main(void){\n  gl_FragColor = v_color;\n}\n"

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\n/*\nvert.glsl\n*/\n\nattribute vec4 a_position;\nattribute vec4 a_color;\n\nuniform mat4 u_matrix;\n\nvarying vec4 v_color;\n\nvoid main() {\n  gl_Position = u_matrix * a_position;\n  v_color = a_color;\n}\n"

/***/ },
/* 5 */
/***/ function(module, exports) {

	var attrib = {};

	attrib.create = function(gl, type, data){
	  var buffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	  gl.bufferData(gl.ARRAY_BUFFER, data, type);
	};

	attrib.enable = function(gl, program, type, name, normalize){
	  var positionLocation = gl.getAttribLocation(program, name);
	  gl.enableVertexAttribArray(positionLocation);
	  gl.vertexAttribPointer(positionLocation, 3, type, normalize, 0, 0);
	};

	module.exports = attrib;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var vec = __webpack_require__(2);
	var mat = __webpack_require__(1);

	var vec3 = vec.vec3;
	var mat4 = mat.mat4;


	var cam = {};


	(function(mat4, vec3){

	  var u = vec3.create();
	  var v = vec3.create();
	  var w = vec3.create();

	  /**
	    A classic LookAt matrix calculation
	    @param {mat4} out The calculated matrix
	    @param {vec3} a The first point (location of the camera)
	    @param {vec3} b The second point
	  **/

	  cam.lookAt = function(out, eye, at){
	    vec3.subtract(w, eye, at);
	    vec3.normalize(w, w);

	    vec3.cross(u, w, vec3.UP);
	    vec3.normalize(u, u);
	    vec3.cross(v, w, u);

	    mat4.assignFromArray(out, [
	      u[0],   u[1],   u[2],   0,
	      v[0],   v[1],   v[2],   0,
	      w[0],   w[1],   w[2],   0,
	      eye[0], eye[1], eye[2], 1
	    ]);
	  };

	})(mat4, vec3);



	(function(mat4){

	  /**
	    Perspective matrix calculation
	    @param {mat4} out The calculated matrix
	    @param {float} fov The field of view in radians
	    @param {float} aspect The aspect ratio of the near and far planes
	    @param {float} near The distance to the near plane along the z-axis
	    @param {float} far The distance to the far plane along the z-axis
	  **/

	  cam.perspective = function(out, fov, aspect, near, far){
	    var f = Math.tan(1.570796 - 0.5 * fov);
	    var irange = 1.0 / (near - far);

	    mat4.assignFromArray(out, [
	        f / aspect,   0,    0,                        0,
	        0,            f,    0,                        0,
	        0,            0,    (near + far) * irange,   -1,
	        0,            0,    near * far * irange * 2,  0
	    ]);
	  };

	})(mat4);


	module.exports = cam;


/***/ },
/* 7 */
/***/ function(module, exports) {

	//var mesh = require('./mesh.js');

	var chunk = {};

	var CHUNK_WIDTH = 10;
	var CHUNK_HEIGHT = 10;
	var CHUNK_DEPTH = 10;

	chunk.CHUNK_WIDTH = CHUNK_WIDTH;
	chunk.CHUNK_HEIGHT = CHUNK_HEIGHT;
	chunk.CHUNK_DEPTH = CHUNK_DEPTH;

	chunk.create = function(){
	  return new Float32Array(CHUNK_WIDTH * CHUNK_HEIGHT * CHUNK_DEPTH);
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	var shader = {};

	shader.create = function(gl, source, type){
	  var s = gl.createShader(type);

	  gl.shaderSource(s, source);
	  gl.compileShader(s);

	  if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
	      console.log('Shader compilation error:\\n' + gl.getShaderInfoLog(s));
	      return false;
	  }

	  return s;
	};
	shader.program = function(gl){
	  //Link the shaders into a program
	  var program = gl.createProgram();
	  for (var i = 1; i < arguments.length; i++){
	    gl.attachShader(program, arguments[i]);
	  }
	  gl.linkProgram(program);
	  gl.useProgram(program);

	  //Check for errors
	  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	      console.log('Program linking Error:\\n' + gl.getProgramInfoLog(program));
	      return false;
	  }

	  return program;
	}


	module.exports = shader;


/***/ }
/******/ ]);