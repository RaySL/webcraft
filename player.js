/*global vec3*/
/*global Input*/


function Player(){
    this.direction = new vec3(0.0);
    
    this.position = new vec3(0.0, 0.0, 1.0);
    this.velocity = new vec3(0.0);
    
    this.speed = 0.2;
    
    this.gravity = vec3(0.0, 0.0, -0.1);
}
Player.prototype = {
    getDirectionUniform: function(){
        return [this.direction.x, this.direction.y, this.direction.z];
    },
    getPositionUniform: function(){
        return [this.position.x, this.position.y, this.position.z];
    },
    
    update: function(){
        this.position.add(this.velocity);
        this.velocity.add(this.gravity);
    },
    collide: function(){
        //uh oh! :O
    },
    move: function(vec){
        this.velocity.add(vec);
    },
    control: function(){
        if (Input.up){
            var vec = this.direction;
            vec.scalar_mul(this.speed);
            this.move(vec);
        }
    }
};

