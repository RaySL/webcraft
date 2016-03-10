/*global vec3*/
/*global Input*/


function terrain(pos){
    var fx = Math.floor(pos.x);
    var fy = Math.floor(pos.y);
    var fz = Math.floor(pos.z);
    var f = new vec3(fx, fy, fz);
    
    
    var rand = vec3.dot(f, new vec3(14.11,86.56,131.43));
    rand = rand - Math.floor(rand);
    
    var x = vec3.dot(f, f)*0.075 - 1.0 - rand * 0.3;
    return 1.0 - x*x < 0.02;
}

function Player(){
    this.direction = new vec3(0.0, 0.0, 1.0);
    
    this.position = new vec3(0.0, 0.0, 2.0);
    this.velocity = new vec3(0.0, 0.0, 0.0);
    
    this.speed = 0.01;
    this.turn = 0.1;
    
    this.gravity = new vec3(0.0, 0.01, 0.0);
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
        this.velocity.add(this.gravity);
    },
    
    collide: function(){
        
        if (terrain(new vec3(this.position.x,
                             this.position.y + 1.5,
                             this.position.z)) || 
            terrain(new vec3(this.position.x,
                             this.position.y - 0.5,
                             this.position.z))) {
            this.position.sub(this.velocity);
            
            this.velocity = new vec3(0.0, 0.0, 0.0);
        }
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
        
        if (Input.space()){
            this.velocity.y -= 0.1;
        }
    }
};

