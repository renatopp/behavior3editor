this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var CameraSystem = b3.Class();
  var p = CameraSystem.prototype;

  p.initialize = function() {
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;

    var this_ = this;
    app.game.stage.on('stagemousedown', this.onMouseDown, this);
    app.game.stage.on('stagemousemove', this.onMouseMove, this);
    app.game.stage.on('stagemouseup', this.onMouseUp, this);
    app.game.canvas.addEventListener('mousewheel', function(event) {
      this_.onMouseWheel(event)
    });
    app.game.canvas.addEventListener('DOMMouseScroll ', function(event) {
      this_.onMouseWheel(event)
    }, false);
  };

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 2) return;
    $(app.game.canvas).addClass('grabbing');

    this.isDragging = true;
    this.offsetX = app.game.stage.mouseX - app.game.camera.x;
    this.offsetY = app.game.stage.mouseY - app.game.camera.y;
  };

  p.onMouseMove = function(event) {
    if (!this.isDragging) return;

    app.game.camera.x = app.game.stage.mouseX - this.offsetX;
    app.game.camera.y = app.game.stage.mouseY - this.offsetY;
  };

  p.onMouseUp = function(event) {
    if (event.nativeEvent.which !== 2) return;

    $(app.game.canvas).removeClass('grabbing');

    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  };

  p.onMouseWheel = function(event) {
    if (event.wheelDeltaY > 0) {
      app.editor.zoomIn();
    } else {
      app.editor.zoomOut();
    }
  }

  b3editor.CameraSystem = CameraSystem;
}());
