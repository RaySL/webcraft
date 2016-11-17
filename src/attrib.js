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
