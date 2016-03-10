/*global vec3*/
/*global Input*/


function terrain(pos){
    var fx = Math.floor(pos.x);
    var fy = Math.floor(pos.y);
    var fz = Math.floor(pos.z);
    
    fx *= 0.5;
    
    var f = new vec3(fx, fy, fz);
    
    
    var rand = fx * 131.43 + fy * 14.11 + fz * 86.56;
    rand = rand - Math.floor(rand);
    
    var x = vec3.dot(f, f)*0.075 * (rand * 0.75 + 1.0) - 1.5;
    return 1.0 - x*x < 0.0;
}

function Player(){
    this.direction = new vec3(0.0, 0.0, 1.0);
    
    this.position = new vec3(0.0, 0.0, 4.0);
    this.velocity = new vec3(0.0, 0.0, 0.0);
    
    this.speed = 0.005;
    this.turn = 0.07;
    
    this.gravity = new vec3(0.0, 0.005, 0.0);
    
    this.jump = 2.0;//How many blocks high to jump
    this.jumpForce = Math.sqrt(2.6*this.jump*this.gravity.y);
    this.grounded = false;
}
Player.prototype = {
    getDirectionUniform: function(){
        return [this.direction.x, this.direction.y, this.direction.z];
    },
    getPositionUniform: function(){
        return [this.position.x, this.position.y, this.position.z];
    },
    
    update: function(){
        this.velocity.scalar_mul(0.99);
        this.velocity.x *= 0.95;
        this.velocity.z *= 0.95;
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
        return terrain(new vec3(this.position.x + 0.4,
                                this.position.y + 0.4,
                                this.position.z + 0.4)) || 
               terrain(new vec3(this.position.x + 0.4,
                                this.position.y + 0.4,
                                this.position.z - 0.4)) ||
               terrain(new vec3(this.position.x + 0.4,
                                this.position.y - 0.4,
                                this.position.z + 0.4)) ||
               terrain(new vec3(this.position.x - 0.4,
                                this.position.y + 0.4,
                                this.position.z + 0.4)) || 
               terrain(new vec3(this.position.x + 0.4,
                                this.position.y - 0.4,
                                this.position.z - 0.4)) || 
               terrain(new vec3(this.position.x - 0.4,
                                this.position.y + 0.4,
                                this.position.z - 0.4)) || 
               terrain(new vec3(this.position.x - 0.4,
                                this.position.y - 0.4,
                                this.position.z + 0.4)) || 
               terrain(new vec3(this.position.x - 0.4,
                                this.position.y - 0.4,
                                this.position.z - 0.4));
    },
    
    collideX: function(){
        this.position.x += this.velocity.x;
        
        if (this.touch()) {   
            this.position.x -= this.velocity.x;
            this.velocity.x *= -0.1;//new vec3(0.0, 0.0, 0.0);
        }
    },
    collideY: function(){
        this.position.y += this.velocity.y;
        
        this.grounded = false;
        if (this.touch()) {
            if (this.velocity.y > 0.0){
                this.grounded = true;
            }
            this.position.y -= this.velocity.y;
            this.velocity.y *= -0.1;
        }
    },
    collideZ: function(){
        this.position.z += this.velocity.z;
        
        if (this.touch()) {
            this.position.z -= this.velocity.z;
            this.velocity.z *= -0.1;
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
        
        if (Input.space() && this.grounded){
            this.velocity.y -= this.jumpForce;
        }
    }
};

