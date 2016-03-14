/*global getFile*/

function VoxelRenderer(canvas){
    this.canvas = canvas;
    this.gl;
    this.program;
    
    this.fragmentCode;
    this.vertexCode;
    
    this.settings = {
            alpha:                          false,
            depth:                          false,
            stencil:                        false,
            antialias:                      false,
            premultipliedAlpha:             false,
            preserveDrawingBuffer:          true,
            failIfMajorPerformanceCaveat:   true
    };
}

VoxelRenderer.prototype = {
    setup: function(){
        this.gl = this.canvas.getContext('webgl',              this.settings) || 
                  this.canvas.getContext('experimental-webgl', this.settings);
                  
        //If WebGL is not available
        if (!this.gl){
            alert('WebGL not supported, try a different browser/computer?'); 
            return;
        }
        
        var gl = this.gl;
        
        //vertex buffer
        var vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        
        //Index buffer
        var index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        
        
        var vertices = [+0.5, +0.5, +0.5,
                        +0.5, -0.5, +0.5,
                        -0.5, +0.5, +0.5,
                        -0.5, -0.5, +0.5];
        var indices = [0,1,2, 3,1,2];
        
        //vertex buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        //Index buffer
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        //gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        var fragment = gl.createShader(gl.FRAGMENT_SHADER);
        var vertex =   gl.createShader(gl.VERTEX_SHADER);
        
        gl.shaderSource(fragment, this.fragmentCode);
        gl.shaderSource(vertex, this.vertexCode);
        
        //Vertex Shader error display
        gl.compileShader(vertex);
        if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)){
            console.log("Vertex Error: " + gl.getShaderInfoLog(vertex));
            return;
        }
        
        //Fragment Shader error display
        gl.compileShader(fragment);
        if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)){
            console.log("Fragment Error: " + gl.getShaderInfoLog(fragment));
            return;
        }
        
        this.program = gl.createProgram();
        
        //Attach the shaders
        gl.attachShader(this.program, vertex);
        gl.attachShader(this.program, fragment);
        
        //Activate the program
        gl.linkProgram(this.program);
        gl.useProgram(this.program);
        
        //Program error display
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
            console.log(gl.getProgramInfoLog(this.program));
            return;
        }
        
    },
    display: function(){
        var gl = this.gl;
        
        var coord = gl.getAttribLocation(this.program, "coordinate");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 
        gl.enableVertexAttribArray(coord);
        
        var time = gl.getUniformLocation(this.program, "time");
        gl.uniform1f(time, (Date.now()/1000)%16384);
        
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.enable(gl.DEPTH_TEST); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
};












