b3e.Node = function(isDefault) {
  "use strict";

  this.spec = null;
  this.name = null;
  this.title = null;
  this.category = null;
  this.description = null;
  this.properties = {};
  this.isDefault = !!isDefault;

  this.copy = function() {
    var n         = new b3e.Node(this.isDefault);
    n.spec        = this.spec;
    n.name        = this.name;
    n.title       = this.title;
    n.category    = this.category;
    n.description = this.description;
    n.properties  = this.properties;
    
    return n;
  }
}