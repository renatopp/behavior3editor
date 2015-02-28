this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Tree = b3.Class();
  var p = Tree.prototype;

  p.initialize = function() {
    this.id = 0;
    this.blocks = [];
    this.connections = [];
    this.selectedBlocks = [];
    this.camera = {
      "camera_x": 0,
      "camera_y": 0,
      "camera_z": 1,
      "x": 0,
      "y": 0
    }
  }

  b3editor.Tree = Tree;
}());
