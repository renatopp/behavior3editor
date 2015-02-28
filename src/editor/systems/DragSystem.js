this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var DragSystem = b3.Class();
  var p = DragSystem.prototype;

  p.initialize = function(params) {
    this.editor = params['editor'];
    this.canvas = params['canvas'];

    this.isDragging = false;

    this.canvas.stage.on('stagemousedown', this.onMouseDown, this);
    this.canvas.stage.on('stagemousemove', this.onMouseMove, this);
    this.canvas.stage.on('stagemouseup', this.onMouseUp, this);
  }

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 1) return;

    // ctrl is for selection
    if (keyboard.ctrl) return;

    // if is already dragging 
    if (this.isDragging) return;
    
    var point = this.canvas.getLocalMousePosition();
    var x = point.x
    var y = point.y
    var block = this.editor.getBlockUnder(x, y);

    // if mouse not on block
    if (!block) return;

    // if no block selected
    if (!block.isSelected) return;

    // if mouse in anchor
    if (!block.mouseInBlock(x, y)) return;

    // start dragging
    this.isDragging = true;

    for (var i=0; i<this.editor.selectedBlocks.length; i++) {
      var block = this.editor.selectedBlocks[i];
      block.isDragging = true;
      block.dragOffsetX = x - block.displayObject.x;
      block.dragOffsetY = y - block.displayObject.y;
    }
  }

  p.onMouseMove = function(event) {
    if (!this.isDragging) return;

    var point = this.canvas.getLocalMousePosition();
    var x = point.x
    var y = point.y

    // // move entity
    for (var i=0; i<this.editor.selectedBlocks.length; i++) {
      var block = this.editor.selectedBlocks[i];

      var dx = x - block.dragOffsetX;
      var dy = y - block.dragOffsetY;

      block.displayObject.x = dx - dx%this.editor.settings.get('snap_x');
      block.displayObject.y = dy - dy%this.editor.settings.get('snap_y');

      // redraw connections linked to the entity
      if (block.inConnection) {
        block.inConnection.redraw();
      }
      for (var j=0; j<block.outConnections.length; j++) {
        block.outConnections[j].redraw();
      }
    }
  }

  p.onMouseUp = function(event) {
    if (event.nativeEvent.which !== 1) return;
    if (!this.isDragging) return;

    this.isDragging = false;
    for (var i=0; i<this.editor.selectedBlocks.length; i++) {
      var block = this.editor.selectedBlocks[i];
      block.isDragging = false;
    }
  }
    
  b3editor.DragSystem = DragSystem;
}());
