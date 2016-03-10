/*global vec3*/
/*global Input*/


function Player(){
    this.direction = new vec3(0.0, 0.0, 1.0);
    
    this.position = new vec3(0.0, 0.0, 1.0);
    this.velocity = new vec3(0.0, 0.0, 0.0);
    
    this.speed = 0.01;
    this.turn = 0.1;
    
    this.gravity = new vec3(0.0, 0.0, -0.01);
}
Player.prototype = {
    getDirectionUniform: function(){
        return [this.direction.x, this.direction.y, this.direction.z];
    },
    getPositionUniform: function(){
        return [this.position.x, this.position.y, this.position.z];
    },
    
    update: function(){
        this.velocity.scalar_mul(0.9);
        this.position.add(this.velocity);
        //this.velocity.add(this.gravity);
    },
    collide: function(){
        //uh oh! :O
    },
    move: function(vec){
        this.velocity.add(vec);
    },
    control: function(){
        //var vec;
        if (Input.up()){
            this.move(new vec3(this.direction.x * this.speed,
                               this.direction.y * this.speed,
                               this.direction.z * this.speed));
        } else if (Input.down()){
            this.move(new vec3(-this.direction.x * this.speed,
                               -this.direction.y * this.speed,
                               -this.direction.z * this.speed));
        }
        
        if (Input.left()){
            this.direction.rotateY(-this.turn);
        }
        if (Input.right()){
            this.direction.rotateY(this.turn);
        }
    }
};

