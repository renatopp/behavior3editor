this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var SelectionSystem = b3.Class();
  var p = SelectionSystem.prototype;

  p.initialize = function() {
    this.isSelecting = false;
    this.ctrl = false;
    this.x1 = 0;
    this.y1 = 0;

    app.game.stage.on('stagemousedown', this.onMouseDown, this);
    app.game.stage.on('stagemousemove', this.onMouseMove, this);
    app.game.stage.on('stagemouseup', this.onMouseUp, this);
  }

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 1) return;

    // if clicked on block
    var point = app.game.getLocalMousePosition();
    var x = point.x;
    var y = point.y;

    var block = app.editor.getBlockUnder(x, y);

    if (block) {
      // if block isnt selected, select it
      if (!block.isSelected) {
        if (block.mouseInBlock(x, y)) {
          if (!key.ctrl) {
            app.editor.deselectAll();
          }

          app.editor.select(block);
        }
      } else if (key.ctrl) {
        app.editor.deselect(block);
      }

    // if clicked on open space
    } else {
      this.isSelecting = true;
      this.x1 = x;
      this.y1 = y;

      if (!key.ctrl) {
        app.editor.deselectAll();
      } else {
        this.ctrl = true;
      }
      // if (key.ctrl) {
      // } else {
      // }
    }
  }

  p.onMouseMove = function(event) {
    if (!this.isSelecting) {
      return;
    }

    var point = app.game.getLocalMousePosition();
    var x = point.x
    var y = point.y

    app.editor.selectionBox.displayObject.visible = true;
    app.editor.selectionBox.redraw(this.x1, this.y1, x, y);
  }

  p.onMouseUp = function(event) {
    if (event.nativeEvent.which !== 1) return;   
    if (!this.isSelecting) return;

    var point = app.game.getLocalMousePosition();
    var x = point.x;
    var y = point.y;

    var x1 = Math.min(this.x1, x);
    var y1 = Math.min(this.y1, y);
    var x2 = Math.max(this.x1, x);
    var y2 = Math.max(this.y1, y);

    for (var i=0; i<app.editor.blocks.length; i++) {
      var block = app.editor.blocks[i];
      if (block.isContainedIn(x1, y1, x2, y2)) {
        app.editor.invertSelection(block);
      }
    }

    app.editor.selectionBox.displayObject.visible = false;
    this.isSelecting = false;
    this.ctrl = false;
  }

  b3editor.SelectionSystem = SelectionSystem;
}());
