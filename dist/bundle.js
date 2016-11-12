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

	var fragSrc = __webpack_require__(1);
	var vertSrc = __webpack_require__(2);

	//var marchingcubes = require('./marchingcubes.js');
	var faces = __webpack_require__(3)
	var Mat4 = __webpack_require__(4);


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


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#define GLSLIFY 1\n#endif\n\n\nuniform float time;\nuniform vec2 res;\n\nvarying vec4 v_color;\n\nvoid main(void){\n  gl_FragColor = v_color;//vec4(0.0, 1.0, 0.0, 1.0);//\n}\n"

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\n/*\nvert.glsl\n*/\n\nattribute vec4 a_position;\nattribute vec4 a_color;\n\nuniform mat4 u_matrix;\n\nvarying vec4 v_color;\n\nvoid main() {\n  gl_Position = u_matrix * a_position;\n  v_color = a_color;\n}\n"

/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Matrix4 = {
	    IDENTITY: [1,0,0,0,
	               0,1,0,0,
	               0,0,1,0,
	               0,0,0,1],

	    create: function(src){
	        var m = Matrix4.IDENTITY;
	        if (src){
	            if (src.length){
	                if (src.length === 16){
	                    return src;
	                }

	                console.error("Matrix4.create(): Bad input length");
	            }
	            console.error("Matrix4.create(): Input must be Array")
	        }
	        return m;
	    },

	    multiply: function(a, b) {
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
	        return [
	            b00*a00 + b01*a10 + b02*a20 + b03*a30,
	            b00*a01 + b01*a11 + b02*a21 + b03*a31,
	            b00*a02 + b01*a12 + b02*a22 + b03*a32,
	            b00*a03 + b01*a13 + b02*a23 + b03*a33,
	            b10*a00 + b11*a10 + b12*a20 + b13*a30,
	            b10*a01 + b11*a11 + b12*a21 + b13*a31,
	            b10*a02 + b11*a12 + b12*a22 + b13*a32,
	            b10*a03 + b11*a13 + b12*a23 + b13*a33,
	            b20*a00 + b21*a10 + b22*a20 + b23*a30,
	            b20*a01 + b21*a11 + b22*a21 + b23*a31,
	            b20*a02 + b21*a12 + b22*a22 + b23*a32,
	            b20*a03 + b21*a13 + b22*a23 + b23*a33,
	            b30*a00 + b31*a10 + b32*a20 + b33*a30,
	            b30*a01 + b31*a11 + b32*a21 + b33*a31,
	            b30*a02 + b31*a12 + b32*a22 + b33*a32,
	            b30*a03 + b31*a13 + b32*a23 + b33*a33,
	        ];
	    },

	    inverse: function(m){
	        var m00 = m[0 * 4 + 0];
	        var m01 = m[0 * 4 + 1];
	        var m02 = m[0 * 4 + 2];
	        var m03 = m[0 * 4 + 3];
	        var m10 = m[1 * 4 + 0];
	        var m11 = m[1 * 4 + 1];
	        var m12 = m[1 * 4 + 2];
	        var m13 = m[1 * 4 + 3];
	        var m20 = m[2 * 4 + 0];
	        var m21 = m[2 * 4 + 1];
	        var m22 = m[2 * 4 + 2];
	        var m23 = m[2 * 4 + 3];
	        var m30 = m[3 * 4 + 0];
	        var m31 = m[3 * 4 + 1];
	        var m32 = m[3 * 4 + 2];
	        var m33 = m[3 * 4 + 3];
	        var tmp_0  = m22 * m33;
	        var tmp_1  = m32 * m23;
	        var tmp_2  = m12 * m33;
	        var tmp_3  = m32 * m13;
	        var tmp_4  = m12 * m23;
	        var tmp_5  = m22 * m13;
	        var tmp_6  = m02 * m33;
	        var tmp_7  = m32 * m03;
	        var tmp_8  = m02 * m23;
	        var tmp_9  = m22 * m03;
	        var tmp_10 = m02 * m13;
	        var tmp_11 = m12 * m03;
	        var tmp_12 = m20 * m31;
	        var tmp_13 = m30 * m21;
	        var tmp_14 = m10 * m31;
	        var tmp_15 = m30 * m11;
	        var tmp_16 = m10 * m21;
	        var tmp_17 = m20 * m11;
	        var tmp_18 = m00 * m31;
	        var tmp_19 = m30 * m01;
	        var tmp_20 = m00 * m21;
	        var tmp_21 = m20 * m01;
	        var tmp_22 = m00 * m11;
	        var tmp_23 = m10 * m01;

	        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
	            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
	        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
	            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
	        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
	            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
	        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
	            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

	        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

	        return [
	          d * t0,
	          d * t1,
	          d * t2,
	          d * t3,
	          d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
	                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
	          d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
	                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
	          d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
	                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
	          d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
	                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
	          d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
	                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
	          d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
	                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
	          d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
	                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
	          d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
	                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
	          d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
	                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
	          d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
	                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
	          d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
	                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
	          d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
	                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
	        ];
	    },

	    perspective: function(fov, aspect, near, far) {
	        var f = Math.tan(1.570796 - 0.5 * fov);
	        var rangeInv = 1.0 / (near - far);

	        return [
	            f / aspect, 0, 0, 0,
	            0, f, 0, 0,
	            0, 0, (near + far) * rangeInv, -1,
	            0, 0, near * far * rangeInv * 2, 0
	        ];
	    },

	    translation: function(tx, ty, tz) {
	        return [
	            1,  0,  0,  0,
	            0,  1,  0,  0,
	            0,  0,  1,  0,
	            tx, ty, tz, 1,
	        ];
	    },

	    xRotation: function(θ) {
	        var c = Math.cos(θ);
	        var s = Math.sin(θ);

	        return [
	            1, 0, 0, 0,
	            0, c, s, 0,
	            0,-s, c, 0,
	            0, 0, 0, 1,
	        ];
	    },

	    yRotation: function(θ) {
	        var c = Math.cos(θ);
	        var s = Math.sin(θ);

	        return [
	            c, 0,-s, 0,
	            0, 1, 0, 0,
	            s, 0, c, 0,
	            0, 0, 0, 1,
	        ];
	    },

	    zRotation: function(θ) {
	        var c = Math.cos(θ);
	        var s = Math.sin(θ);

	        return [
	           c, s, 0, 0,
	          -s, c, 0, 0,
	           0, 0, 1, 0,
	           0, 0, 0, 1,
	        ];
	    },

	    scaling: function(sx, sy, sz) {
	        return [
	            sx, 0,  0,  0,
	            0, sy,  0,  0,
	            0,  0, sz,  0,
	            0,  0,  0,  1,
	        ];
	    },
	};

	module.exports = Matrix4;


/***/ }
/******/ ]);