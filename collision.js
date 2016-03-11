/*global PixelShader, PixelShaderUniform, player*/

var collisionCode = "\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
    precision highp float; \n\
#else\n\
    precision mediump float;\n\
#endif\n\
\n\
\
uniform vec3 position;\
uniform vec3 velocity;\
\
//float hash( in float n ) { return fract(sin(n)*753.5453123); }\n\
//float hash( in float n ) { return fract(fract(n)*753.5453123); }\n\
#define hash(n) fract(sin(mod(n, 3.14159))*627.7327)\n\
float noise( in vec3 x )\
{\
    vec3 p = floor(x);\
    vec3 f = fract(x);\
    f = f*f*(3.0-2.0*f);\
	\
    float n = p.x + p.y*157.0 + 113.0*p.z;\
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),\
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),\
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),\
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);\
}\n\
float terrain(in vec3 p){\
    p *= 0.2;\
    float x = noise(p) + 0.4 + hash(p.x + p.y*157.0 + 113.0*p.z) * 0.1;\
    return 1.0 - x*x;\
}\
void main(){\
    /*if (gl_FragCoord.y > 1.0){\
        gl_FragColor = vec4(0.5);\
        return;\
    }*/\
    \n\
    vec3 pos = vec3(gl_FragCoord.x);\
    pos *= vec3(1.0, 0.5, 0.25);\
    pos = floor(pos);\
    pos = mod(pos, 2.0);\
    pos -= 0.5;\
    pos *= 0.8;\
    \
    vec3 vel = vec3(0.0);\
    if (gl_FragCoord.y < 1.0){\
        vel.x = velocity.x;\
    }\
    if (gl_FragCoord.y > 1.0 && gl_FragCoord.y < 2.0){\
        vel.y = velocity.y;\
    }\
    if (gl_FragCoord.y > 2.0 && gl_FragCoord.y < 3.0){\
        vel.z = velocity.z;\
    }\
    //gl_FragColor = vec4(gl_FragCoord.y);\
    return;\
    \n\
    pos += vel;\
    pos += position;\
    pos = floor(pos);\
    \n\
    float terr = terrain(pos);\
    \n\
    if (terr > 0.0)\
        gl_FragColor = vec4(0.0);\
    else\
        gl_FragColor = vec4(1.0);\
}";

var canvas = document.createElement("canvas");

//Eight pixels per direction
canvas.setAttribute("width", 8);
canvas.setAttribute("height", 3);

var colBuff = new PixelShader(canvas);
var pos = new PixelShaderUniform("position", "uniform3f", player.getPositionUniform, player);
var vel = new PixelShaderUniform("velocity", "uniform3f", player.getVelocityUniform, player);

colBuff.code = collisionCode;
colBuff.setup();

colBuff.addUniform(pos);
colBuff.addUniform(vel);


var data = new Uint8Array(canvas.width * canvas.height * 4);

function collideScene(){
    colBuff.updateUniforms();
    colBuff.display();
    
    colBuff.gl.readPixels(0, 0, canvas.width, canvas.height, 
                          colBuff.gl.RGBA, colBuff.gl.UNSIGNED_BYTE, data);
                                           
    if (data.data){
        data = data.data;
    }
}

function collideSceneX(){
    return data[0] || data[4] || data[8] || data[12] ||
           data[16]|| data[20]|| data[24]|| data[28];
}
function collideSceneY(){
    return data[32]|| data[36]|| data[40]|| data[44]||
           data[48]|| data[52]|| data[56]|| data[60];
}
function collideSceneZ(){
    return data[64]|| data[68]|| data[72]|| data[76] ||
           data[80]|| data[84]|| data[88]|| data[92];
}












