#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float; 
#else
    precision mediump float;
#endif

uniform float time;
uniform vec2 scale;

uniform vec3 position;
uniform vec3 velocity;
uniform vec3 direction;


#define slowrand(n) fract(sin(mod(dot(n, vec3(1.42887,8.6025,13.1525)), 3.14159))*627.7327)
#define fastrand(n) fract(dot(n, vec3(131.43,14.11,86.56)))
#define hash(n) fract(sin(mod(n, 3.14159))*627.7327)


float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float terrain(in vec3 p){
    p *= 0.2;
    float x = noise(p) + 0.4 + hash(p.x + p.y*157.0 + 113.0*p.z) * 0.05;
    return 1.0 - 0.55*p.y - x*x;
}








