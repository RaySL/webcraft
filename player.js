/*global vec3*/
/*global Input*/
/*global collideScene, collideSceneX, collideSceneY, collideSceneZ*/

function mix(a, b, v){
    return a * (1.0 - v) + b * v;
}

function hash(n) { n = Math.sin(n)*753.5453123; return n - Math.floor(n); }
//function hash(n){n -= Math.floor(n); n *= 753.5453123; return n - Math.floor(n);}
function noise(x, y, z){
    var px = Math.floor(x);
    var py = Math.floor(y);
    var pz = Math.floor(z);
    
    var fx = x - px;
    var fy = y - py;
    var fz = z - pz;
    
    fx = fx*fx*(3.0-2.0*fx);
    fy = fy*fy*(3.0-2.0*fy);
    fz = fz*fz*(3.0-2.0*fz);
	
    var n = px + py*157.0 + 113.0*pz;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),fx),
                   mix( hash(n+157.0), hash(n+158.0),fx),fy),
               mix(mix( hash(n+113.0), hash(n+114.0),fx),
                   mix( hash(n+270.0), hash(n+271.0),fx),fy),fz);
}


/*function terrain(pos){
    var fx = Math.floor(pos.x);
    var fy = Math.floor(pos.y);
    var fz = Math.floor(pos.z);
    
    fx *= 0.5;
    
    var f = new vec3(fx, fy, fz);
    
    
    var rand = fx * 131.43 + fy * 14.11 + fz * 86.56;
    rand = rand - Math.floor(rand);
    
    var x = vec3.dot(f, f)*0.075 * (rand * 0.75 + 1.0) - 1.5;
    return 1.0 - x*x < 0.0;
}*/
function terrain(pos){
    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);
    pos.z = Math.floor(pos.z);
    var x = noise(pos.x*0.3, pos.y*0.3, pos.z*0.3) + 0.5;
    return 1.0 - x*x < 0.0;
}

function Player(){
    this.direction = new vec3(0.0, 0.0, 1.0);
    
    this.position = new vec3(0.0, 0.0, 1.0);
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
    getVelocityUniform: function(){
        return [this.velocity.x, this.velocity.y, this.velocity.z];
    },
    
    update: function(){
        this.velocity.scalar_mul(0.99);
        this.velocity.x *= 0.95;
        this.velocity.z *= 0.95;
        //this.position.add(this.velocity);
        this.velocity.add(this.gravity);
    },
    
    collide: function(){
        collideScene();
        this.collideX();
        this.collideY();
        this.collideZ();
    },
    /*touch: function(){
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
    },*/
    touch: function(){
        return collision();
    },
    
    collideX: function(){
        this.position.x += this.velocity.x;
        
        if (collideSceneX()) {   
            this.position.x -= this.velocity.x;
            this.velocity.x *= -0.1;//new vec3(0.0, 0.0, 0.0);
        }
    },
    collideY: function(){
        this.position.y += this.velocity.y;
        
        this.grounded = false;
        if (collideSceneY()) {
            if (this.velocity.y > 0.0){
                this.grounded = true;
            }
            this.position.y -= this.velocity.y;
            this.velocity.y *= -0.1;
        }
    },
    collideZ: function(){
        this.position.z += this.velocity.z;
        
        if (collideSceneZ()) {
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

