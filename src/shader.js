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
};


module.exports = shader;
