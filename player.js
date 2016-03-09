/*global vec3*/


function Player(){
    this.dir = new vec3(0.0);
    
    this.position = new vec3(0.0, 0.0, 1.0);
    this.velocity = new vec3(0.0);
    
    this.gravity = vec3(0.0, 0.0, -0.1);
}
Player.prototype = {
    update: function(){
        this.position.add(this.velocity);
        this.velocity.add(this.gravity);
    },
    collide: function(){
        //uh oh! :O
    },
    move: function(vec){
        this.vel.add(vec);
    }
};
