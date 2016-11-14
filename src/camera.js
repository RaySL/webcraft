var vec = require('./vector.js');
var mat = require('./matrix.js');

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
