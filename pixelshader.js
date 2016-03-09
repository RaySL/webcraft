//Version 0.3

/**
 * pixelshader.js
 * 
 * A small library to create and run 
 * interactive pixel shaders with 
 * GLSL code.
 * 
**/


function PixelShaderUniform(name, type, calculate){
    this.name = name;
    this.type = type;
    
    this.values = [];
    this.calculate = calculate || function(){};
}
PixelShaderUniform.prototype = {
    update: function(values){
        this.values = values;
    },
    addEventListener: function(listener, callback){
        window.addEventListener(listener, function(event){
            this.update(callback(event));
        });
    }
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
    },
    addUniform: function(uniform){
        this.uniforms.push(uniform);
    }
};










