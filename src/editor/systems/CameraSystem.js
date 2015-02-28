this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var CameraSystem = b3.Class();
  var p = CameraSystem.prototype;

  p.initialize = function(params) {
    this.editor = params['editor'];
    this.canvas = params['canvas'];

    // console.log(editor, canvas, a)

    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;

    var this_ = this;
    // console.log(this)
    this.canvas.stage.on('stagemousedown', this.onMouseDown, this);
    this.canvas.stage.on('stagemousemove', this.onMouseMove, this);
    this.canvas.stage.on('stagemouseup', this.onMouseUp, this);
    this.canvas.canvas.addEventListener('mousewheel', function(event) {
      this_.onMouseWheel(event)
    });
    this.canvas.canvas.addEventListener('DOMMouseScroll ', function(event) {
      this_.onMouseWheel(event)
    }, false);
  };

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 2) return;
    this.canvas.canvas.className += " grabbing";

    this.isDragging = true;
    this.offsetX = this.canvas.stage.mouseX - this.canvas.camera.x;
    this.offsetY = this.canvas.stage.mouseY - this.canvas.camera.y;
  };

  p.onMouseMove = function(event) {
    if (!this.isDragging) return;

    this.canvas.camera.x = this.canvas.stage.mouseX - this.offsetX;
    this.canvas.camera.y = this.canvas.stage.mouseY - this.offsetY;
  };

  p.onMouseUp = function(event) {
    if (event.nativeEvent.which !== 2) return;

    this.canvas.canvas.className = this.canvas.canvas.className.replace(/(?:^|\s)grabbing(?!\S)/g, '')

    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  };

  p.onMouseWheel = function(event) {
    if (event.wheelDeltaY > 0) {
      this.editor.zoomIn();
    } else {
      this.editor.zoomOut();
    }
  }

  b3editor.CameraSystem = CameraSystem;
}());
