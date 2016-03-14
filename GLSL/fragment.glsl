#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float; 
#else
    precision mediump float;
#endif

void main(void) {
    vec2 uv = (400.0 - 1.0 * gl_FragCoord.xy) / 400.0;
    gl_FragColor = vec4(uv.x, 0.8, uv.y, 1);
}