//Version 0.2
//Movement not yet supported

alert("included");

/*function setup(){
    var attr={
        alpha:false,
        depth:false,
        stencil:false,
        antialias:false,
        premultipliedAlpha:false,
        preserveDrawingBuffer:true,
        failIfMajorPerformanceCaveat:true
    };
    //create a webgl context
    gl=cnv.getContext('webgl',attr)||cnv.getContext('experimental-webgl',attr);
    
    if(!gl){
        //Something went wrong with the browser
        alert('WebGL not supported, try a different browser?');return;
    }
    
    this.gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
    var buffer=gl.createBuffer();
    this.gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    this.gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    var fragment=gl.createShader(gl.FRAGMENT_SHADER);
    var vertex=gl.createShader(gl.VERTEX_SHADER);
    this.gl.shaderSource(fragment,document.getElementById('fragment').text);
    this.gl.shaderSource(vertex,'attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0,1);}');
    this.gl.compileShader(vertex);
    if(!gl.getShaderParameter(vertex,gl.COMPILE_STATUS)){
        //vertex compile fail
        console.log(gl.getShaderInfoLog(vertex));return;
    }
    
    this.gl.compileShader(fragment);
    if(!gl.getShaderParameter(fragment,gl.COMPILE_STATUS)){
        //fragment compile fail
        var err=gl.getShaderInfoLog(fragment);
        console.log(err);
        alert({message:err,toString:function(){return err;}});
        return;
    }
    
    program = this.gl.createProgram();
    this.gl.attachShader(program,vertex);
    this.gl.attachShader(program,fragment);
    this.gl.linkProgram(program);
    this.gl.useProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
        console.log(gl.getProgramInfoLog(program));return;
    }
    
    //start execution
    window.requestAnimationFrame(draw);
}

function update(){
    var theta = deltaTime * turn;
    
    px += vx;
    py += vy;
    pz += vz;
    
    vx *= 0.9; vy *= 0.9; vz *= 0.9;
    
    if (keys[38] || keys[87]){
        vz += rz * move;
        vx += rx * move;
    }
    if (keys[40] || keys[83]){
        vz -= rz * move;
        vx -= rx * move;
    }
    
    if (keys[37] || keys[65]){
        //cos -sin
        //sin cos
        var t = rx;
        rx = rx * Math.cos(-theta) - rz * Math.sin(-theta);
        rz = t  * Math.sin(-theta) + rz * Math.cos(-theta);
        ry -= theta;
    }
    
    if (keys[39] || keys[68]){
        var t = rx;
        rx = rx * Math.cos(theta) - rz * Math.sin(theta);
        rz = t  * Math.sin(theta) + rz * Math.cos(theta);
        ry += theta;
    }
    
    if (keys[32]){
        vy -= 0.01;
    }
    
}

function draw(){
    var nTime = (Date.now()/1000)%65535;
    deltaTime = nTime - time;
    time = nTime;
    update();
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    var positionLocation=gl.getAttribLocation(program,'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation,2,gl.FLOAT,false,0,0);
    
    var uniformLocation = gl.getUniformLocation(program,'time');
    gl.uniform1f(uniformLocation,time);
    
    var uniformLocation = gl.getUniformLocation(program,'scale');
    gl.uniform2f(uniformLocation,2/gl.drawingBufferWidth,2/gl.drawingBufferHeight);
    
    var uniformLocation = gl.getUniformLocation(program,'mouse');
    gl.uniform2f(uniformLocation,400-mouse.x,mouse.y);
    
    var uniformLocation = gl.getUniformLocation(program,'player');
    gl.uniform3f(uniformLocation, px, py, pz);
    
    var uniformLocation = gl.getUniformLocation(program,'direct');
    gl.uniform3f(uniformLocation, rx, ry, rz);
    
    
    gl.drawArrays(gl.TRIANGLES,0,6);
    loop = window.setTimeout(function(){
        window.requestAnimationFrame(draw);
        window.clearTimeout(loop);
    }, rate);
}

cnv.addEventListener('mousemove',function(event){
    mouse.x=event.pageX-cnv.offsetLeft;
    mouse.y=event.pageY-cnv.offsetTop;
});

window.addEventListener('keydown',
    function(event){
        keys[event.keyCode] = 1;
        event.preventDefault();
    }
);

window.addEventListener('keyup',
    function(event){
        keys[event.keyCode] = 0;
    }
);

var isSetup=false;
window.addEventListener('mouseover',
    function(){
        if(!isSetup){
            setup();
            isSetup=true;
        }
    }
);*/


function PixelShaderUniform(name, type, calculate){
    this.name = name;
    this.type = type;
    
    this.values = [];
    this.calculate = calculate || function(){};
}
PixelShaderUniform.prototype = {
    update: function(){
        this.values = Array.call(null, arguments);
    },
    
};

function PixelShader(canvas){
    this.canvas = canvas;
    
    this.gl;
    this.program;
    this.code;
    
    this.settings = {
            alpha:                          false,
            depth:                          false,
            stencil:                        false,
            antialias:                      false,
            premultipliedAlpha:             false,
            preserveDrawingBuffer:          true,
            failIfMajorPerformanceCaveat:   true
    };
    
    this.uniforms = [];
}
PixelShader.prototype = {
    setup: function(){
        //Create a webgl context
        this.gl = this.canvas.getContext('webgl',              this.settings) || 
                  this.canvas.getContext('experimental-webgl', this.settings);
        
        //If WebGL is not available
        if (!this.gl){
            alert('WebGL not supported, try a different browser?'); 
            return;
        }
        
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        
        var buffer = this.gl.createBuffer();
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, 
                           new Float32Array([-1,-1,+1,
                                             -1,-1,+1,
                                             -1,+1,+1,
                                             -1,+1,+1]), this.gl.STATIC_DRAW);
        
        
        var fragment = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        var vertex =   this.gl.createShader(this.gl.VERTEX_SHADER);
        
        this.gl.shaderSource(fragment, this.code);
        
        //Default vertex code;
        this.gl.shaderSource(vertex, 'attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0,1);}');
        
        
        this.gl.compileShader(vertex);
        //if(!gl.getShaderParameter(vertex, this.gl.COMPILE_STATUS)){
        //    console.log(this.gl.getShaderInfoLog(vertex));return;
        //}
        
        //Fragment Shader Error Display
        this.gl.compileShader(fragment);
        if(!this.gl.getShaderParameter(fragment, this.gl.COMPILE_STATUS)){
            var err = this.gl.getShaderInfoLog(fragment);
            console.log(err);
            alert(err);
            return;
        }
        
        this.program = this.gl.createProgram();
        
        //Attach the shaders
        this.gl.attachShader(this.program, vertex);
        this.gl.attachShader(this.program, fragment);
        
        //Activate the program
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);
        
        //Program Error Display
        if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)){
            console.log(this.gl.getProgramInfoLog(this.program));return;
        }
        
        //start execution
        window.requestAnimationFrame(this.display());
    },
    display: function(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        //Enable vertex shader position attributes
        var positionLocation = this.gl.getAttribLocation(this.program,'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        var pos, uni;
        for (var i = 0, l = this.uniforms.length; i < l; i++){
            uni = this.uniform[i];
            pos = this.gl.getUniformLocation(this.program, uni.name);
            
            if (this.gl[uni.type])
                this.gl[uni.type].apply(null, uni.values)
        }
        
        
        this.gl.drawArrays(this.gl.TRIANGLES,0,6);
    }
};













