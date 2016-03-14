/*global PixelShader, PixelShaderUniform*/
/*global Player, Input*/
/*global getFile*/
/*global VoxelRenderer*/


var canvas = document.getElementsByTagName("canvas")[0];
/*var shader = new PixelShader(canvas);

var player = new Player();
var direction = new PixelShaderUniform("direction", "uniform3f", player.getDirectionUniform, player);
var position = new PixelShaderUniform("position", "uniform3f", player.getPositionUniform, player);

shader.addUniform(direction);
shader.addUniform(position);

var mouse = new PixelShaderUniform("mouse", "uniform2f", Input.mouse, Input);
shader.addUniform(mouse);

var time = new PixelShaderUniform("time", "uniform1f", function(){return Date.now();}, null);
shader.addUniform(time);*/



/*var rate = 1000 / 50; //50fps
function frame(){
    player.control();
    player.update();
    player.collide();
    
    shader.updateUniforms();
    shader.display();
    
    window.requestAnimationFrame(function(){
        window.setTimeout(frame, rate);
    });
}*/

var voxel = new VoxelRenderer(canvas);
function draw(){
    voxel.display();
    
    window.setTimeout(function(){
        window.requestAnimationFrame(draw);
    }, 1000/60);
}
window.addEventListener("load", function(){
    getFile("GLSL/fragment.glsl", function(fragment){
        getFile("GLSL/vertex.glsl", function(vertex){
            voxel.fragmentCode = fragment;
            voxel.vertexCode = vertex;
            
            voxel.setup();
            
            window.requestAnimationFrame(draw);
        });
    });
});








