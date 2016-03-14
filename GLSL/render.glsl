#define FOCAL_LENGTH 1.0

#define MARCH_STEPS 40
#define MARCH_FADE  19.0

#define AMBIENT_LIGHT vec3(0.32, 0.36, 0.4)
#define DIFFUSE_LIGHT vec3(0.5, 0.45, 0.15)

#define GRASS vec3(0.25, 1.0, 0.0)
#define DIRT  vec3(1.0, 0.6, 0.1)
#define STONE vec3(0.7, 0.7, 0.7)

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
        
        if (t > MARCH_FADE) break;
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
    
    float fade = min(t / MARCH_FADE, 1.0);
    col = mix(col * phong, vec3(0.0, 0.6, 1.0),  fade*fade);
    
    return col;
}

void main(){
	vec2 uv = 1.0 - gl_FragCoord.xy / 200.0;
	
    vec3 ro = position;
    vec3 rd = normalize(vec3(uv, FOCAL_LENGTH));
    
    float t = rd.z;
    rd.z = rd.z * direction.z - rd.x * direction.x;
    rd.x = t    * direction.x + rd.x * direction.z;
    
    gl_FragColor = vec4(march(ro, rd), 1.0);
}
