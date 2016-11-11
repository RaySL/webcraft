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

	var marchingcubes = __webpack_require__(3);
	var Mat4 = __webpack_require__(4);


	var gl, program, canvas;
	var meshverts, meshcolors;

	var isofunction = function(x, y, z) {
	    var a = 9 / (x * x + y * y * 0.05 + z * z);
	    var b = 9 / (x * x * 0.05 + y * y + z * z);
	    var c = 9 / (x * x + y * y + z * z * 0.05);
	    return Math.sqrt(a*a+b*b+c*c) - 1;
	};


	//Initialize shaders and draw surface
	var setup = function(){
	    meshverts = new Float32Array(marchingcubes(isofunction, -16, -16, -16, 16, 16, 16));
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
	    cameraMat = Mat4.multiply(cameraMat, Mat4.translation(0, 0, 35));

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

	module.exports = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#define GLSLIFY 1\n#endif\n\n\nuniform float time;\nuniform vec2 res;\n\nvarying vec4 v_color;\n\nvoid main(void){\n  gl_FragColor = v_color;\n}\n"

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\n/*\nvert.glsl\n*/\n\nattribute vec4 a_position;\nattribute vec4 a_color;\n\nuniform mat4 u_matrix;\n\nvarying vec4 v_color;\n\nvoid main() {\n  gl_Position = u_matrix * a_position;\n  v_color = a_color;\n}\n"

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	A highly unoptimized implementation of marching cubes
	**/

	var MARCH_EDGES = [
	  0x0  ,0x109,0x203,0x30a,0x406,0x50f,0x605,0x70c,
	  0x80c,0x905,0xa0f,0xb06,0xc0a,0xd03,0xe09,0xf00,
	  0x190,0x99 ,0x393,0x29a,0x596,0x49f,0x795,0x69c,
	  0x99c,0x895,0xb9f,0xa96,0xd9a,0xc93,0xf99,0xe90,
	  0x230,0x339,0x33 ,0x13a,0x636,0x73f,0x435,0x53c,
	  0xa3c,0xb35,0x83f,0x936,0xe3a,0xf33,0xc39,0xd30,
	  0x3a0,0x2a9,0x1a3,0xaa ,0x7a6,0x6af,0x5a5,0x4ac,
	  0xbac,0xaa5,0x9af,0x8a6,0xfaa,0xea3,0xda9,0xca0,
	  0x460,0x569,0x663,0x76a,0x66 ,0x16f,0x265,0x36c,
	  0xc6c,0xd65,0xe6f,0xf66,0x86a,0x963,0xa69,0xb60,
	  0x5f0,0x4f9,0x7f3,0x6fa,0x1f6,0xff ,0x3f5,0x2fc,
	  0xdfc,0xcf5,0xfff,0xef6,0x9fa,0x8f3,0xbf9,0xaf0,
	  0x650,0x759,0x453,0x55a,0x256,0x35f,0x55 ,0x15c,
	  0xe5c,0xf55,0xc5f,0xd56,0xa5a,0xb53,0x859,0x950,
	  0x7c0,0x6c9,0x5c3,0x4ca,0x3c6,0x2cf,0x1c5,0xcc ,
	  0xfcc,0xec5,0xdcf,0xcc6,0xbca,0xac3,0x9c9,0x8c0,
	  0x8c0,0x9c9,0xac3,0xbca,0xcc6,0xdcf,0xec5,0xfcc,
	  0xcc ,0x1c5,0x2cf,0x3c6,0x4ca,0x5c3,0x6c9,0x7c0,
	  0x950,0x859,0xb53,0xa5a,0xd56,0xc5f,0xf55,0xe5c,
	  0x15c,0x55 ,0x35f,0x256,0x55a,0x453,0x759,0x650,
	  0xaf0,0xbf9,0x8f3,0x9fa,0xef6,0xfff,0xcf5,0xdfc,
	  0x2fc,0x3f5,0xff ,0x1f6,0x6fa,0x7f3,0x4f9,0x5f0,
	  0xb60,0xa69,0x963,0x86a,0xf66,0xe6f,0xd65,0xc6c,
	  0x36c,0x265,0x16f,0x66 ,0x76a,0x663,0x569,0x460,
	  0xca0,0xda9,0xea3,0xfaa,0x8a6,0x9af,0xaa5,0xbac,
	  0x4ac,0x5a5,0x6af,0x7a6,0xaa ,0x1a3,0x2a9,0x3a0,
	  0xd30,0xc39,0xf33,0xe3a,0x936,0x83f,0xb35,0xa3c,
	  0x53c,0x435,0x73f,0x636,0x13a,0x33 ,0x339,0x230,
	  0xe90,0xf99,0xc93,0xd9a,0xa96,0xb9f,0x895,0x99c,
	  0x69c,0x795,0x49f,0x596,0x29a,0x393,0x99 ,0x190,
	  0xf00,0xe09,0xd03,0xc0a,0xb06,0xa0f,0x905,0x80c,
	  0x70c,0x605,0x50f,0x406,0x30a,0x203,0x109,0x0
	];
	var MARCH_TRIANGLES = [
	  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1],
	  [3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1],
	  [3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1],
	  [3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1],
	  [9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1],
	  [9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1],
	  [2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1],
	  [8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1],
	  [9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1],
	  [4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1],
	  [3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1],
	  [1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1],
	  [4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1],
	  [4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1],
	  [9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1],
	  [5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1],
	  [2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1],
	  [9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1],
	  [0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1],
	  [2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1],
	  [10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1],
	  [4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1],
	  [5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1],
	  [5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1],
	  [9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1],
	  [0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1],
	  [1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1],
	  [10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1],
	  [8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1],
	  [2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1],
	  [7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1],
	  [9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1],
	  [2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1],
	  [11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1],
	  [9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1],
	  [5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1],
	  [11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1],
	  [11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1],
	  [1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1],
	  [9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1],
	  [5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1],
	  [2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1],
	  [0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1],
	  [5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1],
	  [6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1],
	  [3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1],
	  [6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1],
	  [5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1],
	  [1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1],
	  [10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1],
	  [6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1],
	  [8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1],
	  [7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1],
	  [3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1],
	  [5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1],
	  [0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1],
	  [9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1],
	  [8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1],
	  [5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1],
	  [0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1],
	  [6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1],
	  [10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1],
	  [10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1],
	  [8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1],
	  [1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1],
	  [3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1],
	  [0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1],
	  [10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1],
	  [3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1],
	  [6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1],
	  [9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1],
	  [8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1],
	  [3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1],
	  [6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1],
	  [0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1],
	  [10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1],
	  [10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1],
	  [2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1],
	  [7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1],
	  [7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1],
	  [2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1],
	  [1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1],
	  [11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1],
	  [8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1],
	  [0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1],
	  [7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1],
	  [10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1],
	  [2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1],
	  [6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1],
	  [7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1],
	  [2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1],
	  [1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1],
	  [10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1],
	  [10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1],
	  [0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1],
	  [7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1],
	  [6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1],
	  [8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1],
	  [9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1],
	  [6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1],
	  [4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1],
	  [10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1],
	  [8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1],
	  [0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1],
	  [1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1],
	  [8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1],
	  [10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1],
	  [4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1],
	  [10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1],
	  [5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1],
	  [11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1],
	  [9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1],
	  [6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1],
	  [7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1],
	  [3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1],
	  [7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1],
	  [9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1],
	  [3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1],
	  [6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1],
	  [9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1],
	  [1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1],
	  [4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1],
	  [7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1],
	  [6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1],
	  [3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1],
	  [0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1],
	  [6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1],
	  [0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1],
	  [11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1],
	  [6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1],
	  [5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1],
	  [9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1],
	  [1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1],
	  [1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1],
	  [10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1],
	  [0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1],
	  [5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1],
	  [10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1],
	  [11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1],
	  [9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1],
	  [7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1],
	  [2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1],
	  [8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1],
	  [9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1],
	  [9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1],
	  [1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1],
	  [9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1],
	  [9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1],
	  [5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1],
	  [0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1],
	  [10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1],
	  [2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1],
	  [0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1],
	  [0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1],
	  [9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1],
	  [5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1],
	  [3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1],
	  [5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1],
	  [8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1],
	  [0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1],
	  [9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1],
	  [0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1],
	  [1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1],
	  [3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1],
	  [4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1],
	  [9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1],
	  [11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1],
	  [11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1],
	  [2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1],
	  [9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1],
	  [3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1],
	  [1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1],
	  [4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1],
	  [4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1],
	  [0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1],
	  [3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1],
	  [3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1],
	  [0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1],
	  [9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1],
	  [1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
	  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
	];



	function interpolate(w1, v1, w2, v2){
	    if (Math.abs(w1) < 1e-4){
	        return v1;
	    } else if (Math.abs(w2) < 1e-4){
	        return v2;
	    } else if (Math.abs(w1 - w2) < 1e-4){
	        return v1;
	    }

	    var mu = w1 / (w1 - w2);
	    return [
	        v1[0] + (v2[0]-v1[0])*mu,
	        v1[1] + (v2[1]-v1[1])*mu,
	        v1[2] + (v2[2]-v1[2])*mu
	    ];
	};


	function polycube(values, points){
	    var me = MARCH_EDGES;
	    var mt = MARCH_TRIANGLES;

	    var cidx = 0;

	    var verts = [];
	    var tris =  [];

	    for (var i = 0; i < 8; i++){
	        if (values[i] > 0) {
	            cidx |= 1 << i;
	        }
	    }

	    var edge = me[cidx];

	    if (edge === 0){
	        return tris;
	    }

	    var ip2 = [1,2,3,0,5,6,7,4,4,5,6,7];
	    var id1,id2;
	    for (var i = 0; i < 12; i++){
	        if ((edge >> i) & 1){
	            id1=i&7;
	            id2=ip2[i];
	            verts[i] = interpolate(values[id1], points[id1], values[id2], points[id2]);
	        }
	    }

	    var tri = mt[cidx];

	    var nt = 0;
	    for (var i = 0; tri[i] >= 0; i += 3){
	        tris[nt] = [
	            verts[tri[i]],
	            verts[tri[i+1]],
	            verts[tri[i+2]]
	        ];
	        nt++;
	    }

	    return tris;
	};


	function marchingcubes(iso, x1, y1, z1, x2, y2, z2){
	  var verts = [];
	  var vertc = 0;
	  var triangles;
	  var values, points;

	  var i,j,k;

	  for (i = x1; i < x2; i++){
	    for (j = y1; j < y2; j++){
	      for (k = z1; k < z2; k++){
	        values = [
	          iso(i, j, k),
	          iso(i, j+1, k),
	          iso(i+1, j+1, k),
	          iso(i+1, j, k),
	          iso(i, j, k+1),
	          iso(i, j+1, k+1),
	          iso(i+1, j+1, k+1),
	          iso(i+1, j, k+1)
	        ];
	        points = [
	          [i, j, k],
	          [i, j+1, k],
	          [i+1, j+1, k],
	          [i+1, j, k],
	          [i, j, k+1],
	          [i, j+1, k+1],
	          [i+1, j+1, k+1],
	          [i+1, j, k+1]
	        ];
	        triangles = polycube(values, points);

	        for (var t = 0, len = triangles.length; t < len; t++){
	          verts[vertc]   = triangles[t][0][0];
	          verts[vertc+1] = triangles[t][0][1];
	          verts[vertc+2] = triangles[t][0][2];
	          verts[vertc+3] = triangles[t][1][0];
	          verts[vertc+4] = triangles[t][1][1];
	          verts[vertc+5] = triangles[t][1][2];
	          verts[vertc+6] = triangles[t][2][0];
	          verts[vertc+7] = triangles[t][2][1];
	          verts[vertc+8] = triangles[t][2][2];
	          vertc += 9;
	        }
	      }
	    }
	  }
	  return verts;
	};

	module.exports = marchingcubes;


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