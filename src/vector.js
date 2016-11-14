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
