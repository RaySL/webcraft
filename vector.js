function vec3(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}
vec3.prototype = {
    normalize: function(){
        var im = 1.0 / this.length();
        this.x *= im; this.y *= im; this.z *= im;
    },
    length: function(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    
    
    add: function(that){
        this.x += that.x;
        this.y += that.y;
        this.z += that.z;
    },
    mul: function(that){
        this.x *= that.x;
        this.y *= that.y;
        this.z *= that.z;
    },
    sub: function(that){
        this.x -= that.x;
        this.y -= that.y;
        this.z -= that.z;
    },
    div: function(that){
        this.x /= that.x;
        this.y /= that.y;
        this.z /= that.z;
    },
    
    
    scalar_add: function(scalar){
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
    },
    scalar_mul: function(scalar){
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    },
    scalar_sub: function(scalar){
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;
    },
    scalar_div: function(scalar){
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
};

vec3.dot = function(v1, v2){
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
};
vec3.cross = function(v1, v2){
    //
};


vec3.right                  = new vec3(1.0, 0.0, 0.0);
vec3.left                   = new vec3(-1.0, 0.0, 0.0);
vec3.up     = vec3.top      = new vec3(0.0, 1.0, 0.0);
vec3.down   = vec3.bottom   = new vec3(0.0, -1.0, 0.0);
vec3.front  = vec3.forward  = new vec3(0.0, 0.0, 1.0);
vec3.back   = vec3.backward = new vec3(0.0, 0.0, -1.0);














