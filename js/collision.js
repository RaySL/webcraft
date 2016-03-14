/*global PixelShader, PixelShaderUniform, player*/
/*global getFile*/

var canvas = document.createElement("canvas");

//Eight pixels per direction
canvas.setAttribute("width", 8);
canvas.setAttribute("height", 3);

var colBuff = new PixelShader(canvas);
var pos = new PixelShaderUniform("position", "uniform3f", player.getPositionUniform, player);
var vel = new PixelShaderUniform("velocity", "uniform3f", player.getVelocityUniform, player);

colBuff.addUniform(pos);
colBuff.addUniform(vel);


var data = new Uint8Array(canvas.width * canvas.height * 4);

function collideScene(){
    if (!colBuff.gl) return;
    
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

window.addEventListener("load", function(){
    getFile("GLSL/terrain.glsl", function(terrain){
        getFile("GLSL/collide.glsl", function(collide){
            colBuff.code = terrain + collide;
            colBuff.setup();
        });
    });
});










