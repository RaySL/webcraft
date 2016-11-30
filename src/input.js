var input = {};

input.ON_SHIFT    = 1;
input.SHIFT_SHIFT = 2;
input.CTRL_SHIFT  = 3;
input.ALT_SHIFT   = 4;
input.META_SHIFT  = 5;

input.ON_MASK    = 1 << input.ON_SHIFT;
input.SHIFT_MASK = 1 << input.SHIFT_SHIFT;
input.CTRL_MASK  = 1 << input.CTRL_SHIFT;
input.ALT_MASK   = 1 << input.ALT_SHIFT;
input.META_MASK  = 1 << input.META_SHIFT;

(function(){
  var keys = [];

  input.initialize = function(){
    window.addEventListener("keydown", function(event){
      keys[event.keyCode] = (1                << input.ON_SHIFT   ) |
                            (event.shiftKey   << input.SHIFT_SHIFT) |
                            (event.ctrlKey    << input.CTRL_SHIFT ) |
                            (event.altKey     << input.ALT_SHIFT  ) |
                            (event.metaKey    << input.META_SHIFT );
    });

    window.addEventListener("keyup", function(event){
      keys[event.key] = 0;
    });
  };

  input.get = function(code){
    return keys[code];
  };
});

input.initialize();

module.exports = input;
