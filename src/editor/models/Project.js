this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Project = b3.Class();
  var p = Project.prototype;

  p.initialize = function() {
    this.name = null;
    this.filePath = null;
    this.trees = [];
    this.customNodes = [];
  }

  b3editor.Project = Project;
}());
