#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float; 
#else
    precision mediump float;
#endif

#define AMBIENT vec3(0.2, 0.1, 0.05)
#define DIFFUSE vec3(0.8)

varying vec3 vNormal;

void main(void) {
    //vec2 uv = (400.0 - 1.0 * gl_FragCoord.xy) / 400.0;
    gl_FragColor = vec4(1.0);//AMBIENT + DIFFUSE * dot(vNormal, vec3(-0.57735));
}