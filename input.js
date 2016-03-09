var canvas = document.getElementsByTagName("canvas")[0];

var Input = {
    _keys: new Array(127).fill(0),
    _mouse: [0, 0],
    
    keys: function(){
        return this._keys;
    },
    
    //Arrow keys and WASD
    up: function(){
        return this._keys[38] || this._keys[87];
    },
    down: function(){
        return this._keys[40] || this._keys[83];
    },
    left: function(){
        return this._keys[37] || this._keys[65];
    },
    right: function(){
        return this._keys[39] || this._keys[68];
    },
    
    mouse: function(){
        return this._mouse;
    }
};

canvas.addEventListener("keydown", function(event){
    Input._keys[event.keyCode] = 1;
});
canvas.addEventListener("keyup", function(event){
    Input._keys[event.keyCode] = 0;
});
canvas.addEventListener("mousemove", function(event){
    Input._mouse = [
        event.pageX - this.offsetLeft,
        event.pageY - this.offsetTop
    ];
});







