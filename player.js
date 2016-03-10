/*global vec3*/
/*global Input*/


function terrain(pos){
    var fx = Math.floor(pos.x);
    var fy = Math.floor(pos.y);
    var fz = Math.floor(pos.z);
    var f = new vec3(fx, fy, fz);
    
    
    var rand = vec3.dot(f, new vec3(14.11,86.56,131.43));
    rand = rand - Math.floor(rand|0);
    
    var x = vec3.dot(f, f)*0.075 - 1.2;// - rand * 0.3;
    return 1.0 - x*x < 0.0;
}

function Player(){
    this.direction = new vec3(0.0, 0.0, 1.0);
    
    this.position = new vec3(0.0, 0.0, 3.0);
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
        //this.position.add(this.velocity);
        this.velocity.add(this.gravity);
    },
    
    collide: function(){
        this.collideX();
        this.collideY();
        this.collideZ();
    },
    touch: function(){
        //check corners of cube
        return terrain(new vec3(this.position.x + 0.5,
                                this.position.y + 0.5,
                                this.position.z + 0.5)) || 
               terrain(new vec3(this.position.x + 0.5,
                                this.position.y + 0.5,
                                this.position.z - 0.5)) ||
               terrain(new vec3(this.position.x + 0.5,
                                this.position.y - 0.5,
                                this.position.z + 0.5)) ||
               terrain(new vec3(this.position.x - 0.5,
                                this.position.y + 0.5,
                                this.position.z + 0.5)) || 
               terrain(new vec3(this.position.x + 0.5,
                                this.position.y - 0.5,
                                this.position.z - 0.5)) || 
               terrain(new vec3(this.position.x - 0.5,
                                this.position.y + 0.5,
                                this.position.z - 0.5)) || 
               terrain(new vec3(this.position.x - 0.5,
                                this.position.y - 0.5,
                                this.position.z + 0.5)) || 
               terrain(new vec3(this.position.x - 0.5,
                                this.position.y - 0.5,
                                this.position.z - 0.5));
    },
    
    collideX: function(){
        this.position.x += this.velocity.x;
        
        if (this.touch()) {   
            this.position.x -= this.velocity.x;
            //this.position.x = Math.floor(this.position.x);
            
            this.velocity.x *= -0.1;//new vec3(0.0, 0.0, 0.0);
        }
    },
    collideY: function(){
        this.position.y += this.velocity.y;
        
        if (this.touch()) {
            this.position.y -= this.velocity.y;
            //this.position.x = Math.floor(this.position.x);
            
            this.velocity.y *= -0.1;//new vec3(0.0, 0.0, 0.0);
        }
    },
    collideZ: function(){
        this.position.z += this.velocity.z;
        
        if (this.touch()) {
            this.position.z -= this.velocity.z;
            //this.position.x = Math.floor(this.position.x);
            
            this.velocity.z *= -0.1;//new vec3(0.0, 0.0, 0.0);
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

