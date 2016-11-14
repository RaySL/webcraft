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
