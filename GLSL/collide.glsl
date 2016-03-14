void main(){
    vec3 pos = vec3(gl_FragCoord.x);
    pos *= vec3(1.0, 0.5, 0.25);
    pos = floor(pos);
    pos = mod(pos, 2.0);
    pos -= 0.5;
    pos *= 0.8;
    
    vec3 vel = vec3(0.0);
    if (gl_FragCoord.y < 1.0){
        vel.x = velocity.x;
    }
    if (gl_FragCoord.y > 1.0 && gl_FragCoord.y < 2.0){
        vel.y = velocity.y;
    }
    if (gl_FragCoord.y > 2.0 && gl_FragCoord.y < 3.0){
        vel.z = velocity.z;
    }
    
    pos += vel;
    pos += position;
    pos = floor(pos);
    
    if (terrain(pos) > 0.0)
        gl_FragColor = vec4(0.0);
    else
        gl_FragColor = vec4(1.0);
}
