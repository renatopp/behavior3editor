b3e.Command = function(undo, redo) {
  "use strict";

  this.context = null;

  if (undo.length !== 3) throw 'Invalid undo command, must have [target, method, args]';
  if (redo.length !== 3) throw 'Invalid redo command, must have [target, method, args]';

  function execute(target, method, args) {
    method.apply(target, args);
  }

  this.redo = function() {
    execute(redo[0], redo[1], redo[2]);
  }
  this.undo = function() {
    execute(undo[0], undo[1], undo[2]);
  }
}

b3e.Commands = function(commands) {
  "use strict";

  this.context = null;

  this.redo = function() {
    for (var i=0; i<commands.length; i++) {
      commands[i].redo();
    }
  }
  this.undo = function() {
    for (var i=commands.length-1; i>=0; i--) {
      commands[i].undo();
    }
  }
}