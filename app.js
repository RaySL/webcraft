//Webcraft v0.0


/*global PixelShader, PixelShaderUniform*/
/*global Input*/
/*global Player*/


var canvas = document.getElementsByTagName("canvas")[0];


var shader = new PixelShader(canvas);

shader.code = document.getElementById("fragment").text;

shader.setup();


var player = new Player();
var direction = new PixelShaderUniform("direct", "uniform3f", player.getDirectionUniform, player);
var position = new PixelShaderUniform("player", "uniform3f", player.getPositionUniform, player);

shader.addUniform(direction);
shader.addUniform(position);

//var mouse = new PixelShaderUniform("mouse", "uniform2f", Input.mouse);
//shader.addUniform(mouse);



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

window.addEventListener("load", function(){
    window.requestAnimationFrame(frame);
});














