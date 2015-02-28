this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  b3editor.extend = function() {
    for(var i=1; i<arguments.length; i++) {
      for(var key in arguments[i]) {
        if(arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }
    return arguments[0];
  }
}());
