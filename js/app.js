/*global PixelShader, PixelShaderUniform*/
/*global Player, Input*/
/*global getFile*/


var canvas = document.getElementsByTagName("canvas")[0];
var shader = new PixelShader(canvas);

var player = new Player();
var direction = new PixelShaderUniform("direction", "uniform3f", player.getDirectionUniform, player);
var position = new PixelShaderUniform("position", "uniform3f", player.getPositionUniform, player);

shader.addUniform(direction);
shader.addUniform(position);

var mouse = new PixelShaderUniform("mouse", "uniform2f", Input.mouse, Input);
shader.addUniform(mouse);

var time = new PixelShaderUniform("time", "uniform1f", function(){return Date.now();}, null);
shader.addUniform(time);



var rate = 1000 / 50; //50fps
function frame(){
    player.control();
    player.update();
    player.collide();
    
    shader.updateUniforms();
    shader.display();
    
    window.requestAnimationFrame(function(){
        window.setTimeout(frame, rate);
    });
}

//launch
window.addEventListener("load", function(){
    getFile("GLSL/terrain.glsl", function(terrain){
        getFile("GLSL/render.glsl", function(render){
            shader.code = terrain + render;
            shader.setup();
            
            window.requestAnimationFrame(frame);
        });
    });
});
