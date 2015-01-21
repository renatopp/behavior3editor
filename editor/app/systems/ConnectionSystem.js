this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var ConnectionSystem = b3.Class();
  var p = ConnectionSystem.prototype;

  p.initialize = function() {
    this.entity = null;

    app.game.stage.on('stagemousedown', this.onMouseDown, this);
    app.game.stage.on('stagemousemove', this.onMouseMove, this);
    app.game.stage.on('stagemouseup', this.onMouseUp, this);
  }

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 1) return;

    // if clicked on block
    var point = app.game.getLocalMousePosition();
    var x = point.x
    var y = point.y
    var block = app.editor.getBlockUnder(x, y);

    if (this.entity || !block) return;

    if (block.mouseInRightAnchor(x, y)) {
      // if user clicked at the outAnchor
      this.entity = app.editor.addConnection(block);

    } else if (block.mouseInLeftAnchor(x, y)) {
      // if user clicked at the inAnchor
      var connection = block.inConnection;
      if (!connection)
          return;

      block.removeInConnection();
      connection.removeOutBlock();

      this.entity = connection;
    }
  }

  p.onMouseMove = function(event) {
    // if no entity, return
    if (!this.entity) return;

    var point = app.game.getLocalMousePosition();
    var x = point.x
    var y = point.y

    // redraw
    this.entity.redraw(null, null, x, y);
  }

  p.onMouseUp = function(event) {
      if (event.nativeEvent.which !== 1) return;

      // if no entity, return
      if (!this.entity) return;

      var point = app.game.getLocalMousePosition();
      var x = point.x;
      var y = point.y;
      var block = app.editor.getBlockUnder(x, y);

      // if not entity or entity but no block
      if (!block || block === this.entity.inBlock || block.category === 'root') {
          app.editor.removeConnection(this.entity);
      } else {
          // if double parent on node
          if (block.inConnection) {
              app.editor.removeConnection(block.inConnection);
          }

          // if double children on root
          if ((this.entity.inBlock.category === 'root' || this.entity.inBlock.category === 'decorator') &&
                  this.entity.inBlock.outConnections.length > 1) {
              app.editor.removeConnection(this.entity.inBlock.outConnections[0]);
          }

          this.entity.addOutBlock(block);
          block.addInConnection(this.entity);

          this.entity.redraw();
      }

      this.entity = null;
  }

  b3editor.ConnectionSystem = ConnectionSystem;
}());
