#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float; 
#else
    precision mediump float;
#endif

uniform float time;
uniform vec2 scale;

uniform vec3 player;
uniform vec3 direct;


#define FOCAL_LENGTH 1.25

#define MARCH_STEPS 24
#define MARCH_FADE  20.0

#define AMBIENT_LIGHT vec3(0.32, 0.36, 0.4)
#define DIFFUSE_LIGHT vec3(0.5, 0.45, 0.25)

#define GRASS vec3(0.25, 1.0, 0.0)
#define DIRT  vec3(1.0, 0.6, 0.1)
#define STONE vec3(0.7, 0.7, 0.7)



#define slowrand(n) fract(sin(mod(dot(n, vec3(1.42887,8.6025,13.1525)), 3.14159))*627.7327)
#define fastrand(n) fract(dot(n, vec3(14.11,86.56,131.43)))

float rotate(inout vec2 v, in float angle){
    float t = v.x;
    float c = cos(angle);
    float s = sin(angle);
    
    v.x = v.x * c - v.z * c;
    v.z = t   * c + v.z * c;
}


float terrain(in vec3 p){
    float x = dot(p, p)*0.075 - 1.0 - fastrand(p) * 0.3;
    return 1.0 - x*x;
}

vec3 march(in vec3 ro, in vec3 rd){
    vec3 dt = abs(1.0 / rd);
    vec3 p = floor(ro);
    vec3 n = max(vec3(0.00001), 1.0 / rd) - (ro - p) / rd;
    vec3 inc = sign(rd);
    
    float t = 0.0;
    
    vec3 surf;
    
    for (int i = 0; i < MARCH_STEPS; i++){
        surf = vec3(0);
        if(n.x < n.y) {
            if(n.x < n.z) {
                p.x += inc.x;
                t = n.x;
                n.x += dt.x;
                surf.x = inc.x;
            } else {
                p.z += inc.z;
                t = n.z;
                n.z += dt.z;
                surf.z = inc.z;
            }
        } else {
            if(n.y < n.z) {
                p.y += inc.y;
                t = n.y;
                n.y += dt.y;
                surf.y = inc.y;
            } else {
                p.z += inc.z;
                t = n.z;
                n.z += dt.z;
                surf.z = inc.z;
            }
        }
        
        if (terrain(p) < 0.0) break;
    }
    
    ro += rd * t;
    
    vec3 col;
    if (terrain(p-vec3(0,1,0)) >= 0.0 && 
        (surf.y > 0.5 || fract(ro-0.0001).y < 0.25)){
        col = GRASS;
    } else {
        if (p.y < 2.0 - fastrand(p)*3.0){ 
            col = DIRT;
        } else {
            col = STONE;
        }
    }
    
    float mul = slowrand(floor(ro*12.0+0.001));
    
    col *= mul * 0.3 + 0.7;
    
    vec3 phong = AMBIENT_LIGHT;
    phong += max(0.2, dot(rd, surf)) * DIFFUSE_LIGHT;
    
    vec3 bright = phong * (1.0 - t / MARCH_FADE);
    
    return col * bright;
}

void main()
{
	vec2 uv = 1.0 - scale * gl_FragCoord.xy;
	
    vec3 ro = player;
    vec3 rd = normalize(vec3(uv, FOCAL_LENGTH));
    
    rotate(rd.xz, direect.y);
    
    gl_FragColor = vec4(march(ro, rd), 1.0);
}


