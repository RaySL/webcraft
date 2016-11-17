/*
frag.glsl
*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

varying vec4 v_color;

void main(void){
  gl_FragColor = v_color;
}
