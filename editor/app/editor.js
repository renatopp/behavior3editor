this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Editor = b3.Class(createjs.EventDispatcher);

  var p = Editor.prototype;
  
  p._initialize = function() {
    this.blocks           = [];
    this.connections      = [];
    this.nodes            = {};
    this.symbols          = {};
    this.shapes           = {};
    this.systems          = [];
    this.clipboard        = [];
    this.selectedBlocks   = [];
    this.selectionBox     = new b3editor.SelectionBox();
    this.insertingBlockId = null;
    this.defaultNodes     = [
        b3editor.Root,
        b3.Sequence,
        b3.Priority,
        b3.MemSequence,
        b3.MemPriority,
        b3.Repeater,
        b3.RepeatUntilFailure,
        b3.RepeatUntilSuccess,
        b3.MaxTime,
        b3.Inverter,
        b3.Limiter,
        b3.Failer,
        b3.Succeeder,
        b3.Runner,
        b3.Error,
        b3.Wait
    ];
    this.organizer   = new b3editor.Organizer();

    // register system
    this.registerSystem(new b3editor.CameraSystem());
    this.registerSystem(new b3editor.SelectionSystem());
    this.registerSystem(new b3editor.DragSystem());
    this.registerSystem(new b3editor.ConnectionSystem());

    // register shape
    this.registerShape('root',      b3editor.draw.rootShape);
    this.registerShape('composite', b3editor.draw.compositeShape);
    this.registerShape('decorator', b3editor.draw.decoratorShape);
    this.registerShape('condition', b3editor.draw.conditionShape);
    this.registerShape('action',    b3editor.draw.actionShape);

    // register symbol
    this.registerSymbol('Root',         b3editor.draw.rootSymbol);
    this.registerSymbol('Sequence',     b3editor.draw.sequenceSymbol);
    this.registerSymbol('MemSequence',  b3editor.draw.memsequenceSymbol);
    this.registerSymbol('Priority',     b3editor.draw.prioritySymbol);
    this.registerSymbol('MemPriority',  b3editor.draw.memprioritySymbol);

    // register node
    for (var i = 0; i < this.defaultNodes.length; i++) {
      this.registerNode(this.defaultNodes[i]);
    };

    app.game.layerOverlay.addChild(this.selectionBox.displayObject);

    this.reset();
    this.center();
  };

  // INTERNAL =================================================================
  p.registerNode = function(node) {
    // TODO: raise error if node is invalid
    var name = node.prototype.name;
    this.nodes[name] = node;
  }
  p.registerSymbol = function(category, symbol) {
    if (!symbol) {
      symbol = category;
    }
    this.symbols[category] = symbol;
  }
  p.registerShape = function(name, shape) {
    this.shapes[name] = shape;
  }
  p.registerSystem = function(system, priority) {
    if (priority) {
      this.systems.splice(0, 0, system);
    } else {
      this.systems.push(system);
    }
  }
  p.getRoot = function() {
    for (var i=0; i<this.blocks.length; i++) {
      if (this.blocks[i].category === 'root') {
        return this.blocks[i];
      }
    }
  }
  p.getBlockUnder = function(x, y) {
    if (!x || !y) {
      var point = app.game.getLocalMousePosition();
      x = point.x;
      y = point.y;
    }

    // Get block under the mouse
    for (var i=this.blocks.length-1; i>=0; i--) {
      var block = this.blocks[i];

      // Verify collision
      if (block.hitTest(x, y)) {
        return block;
      }
    }
  }
  p.getBlockById = function(id) {
    for (var i=0; i<this.blocks.length; i++) {
      var block = this.blocks[i];
      if (block.id == id) {
        return block;
      }
    }
  }
  p.applySettings = function(settings) {
    var settings = settings || app.settings;
    app.game.applySettings(settings);
    for (var i=0; i<this.blocks.length; i++) {
      this.blocks[i].applySettings(settings);
    }
    for (var i=0; i<this.connections.length; i++) {
      this.connections[i].applySettings(settings);
    }
  }
  p.importFromJSON = function(json) {
    this.reset();

    var data = JSON.parse(json);
    var dataRoot = null;
    var hasDisplay = (data.display)?true:false;

    if (data.custom_nodes) {
      for (var i = 0; i < data.custom_nodes.length; i++) {
        var template = data.custom_nodes[i];
        if (!this.nodes[template.name]) {
          //If the node doesn't allready exist
          this.createNodeType(template);
        }   
      };
    }

    // Nodes
    for (var id in data.nodes) {
      var spec = data.nodes[id];

      spec.display = spec.display || {};

      var block = this.addBlock(spec.name, spec.display.x, spec.display.y);
      block.id = spec.id;
      block.title = spec.title;
      block.description = spec.description;
      block.parameters = spec.parameters;
      block.properties = spec.properties;
      block.redraw();

      if (block.id === data.root) {
        dataRoot = block;
      }
    }

    // Connections
    for (var id in data.nodes) {
      var spec = data.nodes[id];
      var inBlock = this.getBlockById(id);

      var children = null;
      if (inBlock.category == 'composite' && spec.children) {
        children = spec.children;
      }
      else if (inBlock.category == 'decorator' && spec.child ||
               inBlock.category == 'root' && spec.child) {
        children = [spec.child]
      }
      
      if (children) {
        for (var i=0; i<children.length; i++) {
          var outBlock = this.getBlockById(children[i]);
          this.addConnection(inBlock, outBlock);
        }
      }
    }

    if (dataRoot) {
      this.addConnection(this.getRoot(), dataRoot);
    }

    data.display = data.display || {};
    app.game.camera.x      = data.display.camera_x || 0;
    app.game.camera.y      = data.display.camera_y || 0;
    app.game.camera.scaleX = data.display.camera_z || 1;
    app.game.camera.scaleY = data.display.camera_z || 1;

    // Auto organize
    if (!hasDisplay) {
      this.organize(true);
    }
  }
  p.exportToJSON = function() {
    var root = this.getRoot();
    var data = {};

    // Tree data
    data.title       = root.title;
    data.description = root.description;
    data.root        = root.getOutNodeIds()[0] || null;
    data.display     = {
      'camera_x' : app.game.camera.x,
      'camera_y' : app.game.camera.y,
      'camera_z' : app.game.camera.scaleX,
      'x'        : root.displayObject.x,
      'y'        : root.displayObject.y
    }
    data.properties  = root.properties;
    data.nodes       = {};
    data.custom_nodes = [];
    for(var key in this.nodes) {
      var node = this.nodes[key];
      if (this.defaultNodes.indexOf(node) === -1) {
        var item = {
          "name" : node.prototype.name,
          "title" : node.prototype.title,
          "category": node.prototype.category,
        };
        data.custom_nodes.push(item);
      }
    }

    // Node Spec
    for (var i=0; i<this.blocks.length; i++) {
      var block = this.blocks[i];

      if (block.category === 'root') continue;

      var spec = {};
      spec.id          = block.id,
      spec.name        = block.name,
      spec.title       = block.title,
      spec.description = block.description;
      spec.display     = {
        'x' : block.displayObject.x,
        'y' : block.displayObject.y
      }
      spec.parameters  = block.parameters;
      spec.properties  = block.properties;

      var children = block.getOutNodeIdsByOrder();
      if (block.category == 'composite') {
        spec.children = children;
      } else if (block.category == 'decorator' || block.category == 'root') {
        spec.child = children[0] || null;
      }

      data.nodes[block.id] = spec;
    }

    return JSON.stringify(data, null, 4);
  }
  p.createNodeType = function(template) {
    var classes = {
      'composite' : b3.Composite,
      'decorator' : b3.Decorator,
      'condition' : b3.Condition,
      'action' : b3.Action,
    };
    var category = template.category;
    var cls = classes[category];
    
    var tempClass = b3.Class(cls);
    tempClass.prototype.name = template.name;
    tempClass.prototype.title = template.title;
    
    this.registerNode(tempClass);
  }
  // ==========================================================================
  
  // VIEWER ===================================================================
  p.zoom = function(factor) {
    app.game.camera.scaleX = factor;
    app.game.camera.scaleY = factor;
  }
  p.pan = function(x, y) {
    app.game.camera.x += x;
    app.game.camera.y += y;
  }
  p.setcam = function(x, y) {
    app.game.camera.x = x;
    app.game.camera.y = y;
  }
  p.center = function() {
    var hw = app.game.canvas.width/2;
    var hh = app.game.canvas.height/2;
    this.setcam(hw, hh);
  }
  p.organize = function(orderByIndex) {
    this.organizer.organize(this.getRoot(), orderByIndex);
  }
  p.reset = function(all) {
    // REMOVE BLOCKS
    for (var i=0; i<this.blocks.length; i++) {
      var block = this.blocks[i];
      app.game.layerBlocks.removeChild(block.displayObject);
    }
    this.blocks = [];

    // REMOVE CONNECTIONS
    for (var i=0; i<this.connections.length; i++) {
      var conn = this.connections[i];
      app.game.layerConnections.removeChild(conn.displayObject);
    }
    this.connections = [];

    app.game.camera.x = 0;
    app.game.camera.y = 0;
    app.game.camera.scaleX = 1;
    app.game.camera.scaleY = 1;

    if (!all) {
      this.addBlock('Root', 0, 0);
    }
  }
  p.snap = function(blocks) {
    if (!blocks) {
      blocks = this.blocks;
    }
    else if (!$.isArray(blocks)) {
      blocks = [blocks];
    }

    var snap_x = app.settings.get('snap_x');
    var snap_y = app.settings.get('snap_y');

    for (var i=0; i<blocks.length; i++) {
      var block = blocks[i];
      block.displayObject.x -= block.displayObject.x%snap_x;
      block.displayObject.y -= block.displayObject.y%snap_y;
    }
  }
  p.addBlock = function(name, x, y) {
    x = x || 0;
    y = y || 0;

    if (typeof name == 'string') {
      var node = this.nodes[name];
    } else {
      var node = name;
    }

    var block = new b3editor.Block(node);
    block.displayObject.x = x;
    block.displayObject.y = y;

    this.blocks.push(block);
    app.game.layerBlocks.addChild(block.displayObject);

    return block;
  }
  p.addConnection = function(inBlock, outBlock) {
    var connection = new b3editor.Connection(this);

    if (inBlock) {
      connection.addInBlock(inBlock);
      inBlock.addOutConnection(connection);
    }

    if (outBlock) {
      connection.addOutBlock(outBlock);
      outBlock.addInConnection(connection);
    }

    this.connections.push(connection);
    app.game.layerConnections.addChild(connection.displayObject);

    connection.redraw();

    return connection;
  }
  p.removeBlock = function(block) {
    var index = this.blocks.indexOf(block);
    if (index > -1) this.blocks.splice(index, 1);


    if (block.inConnection) {
      this.removeConnection(block.inConnection);
    }

    if (block.outConnections.length > 0) {
      for (var i=block.outConnections.length-1; i>=0; i--) {
        this.removeConnection(block.outConnections[i]);
      }
    }

    app.game.layerBlocks.removeChild(block.displayObject);
  }
  p.removeConnection = function(connection) {
    if (connection.inBlock) {
      connection.inBlock.removeOutConnection(connection);
      connection.removeInBlock();
    }

    if (connection.outBlock) {
      connection.outBlock.removeInConnection();
      connection.removeOutBlock();
    }

    var index = this.connections.indexOf(connection);
    if (index > -1) this.connections.splice(index, 1);

    app.game.layerConnections.removeChild(connection.displayObject);
  }
  // ==========================================================================
  
  // EDITOR INTERFACE =========================================================
  p.select = function(block) {
    if (block.isSelected) return;

    var event = new createjs.Event('blockselect');
    event._target = block;
    this.dispatchEvent(event);

    block.select();
    this.selectedBlocks.push(block)
  }
  p.deselect = function(block) {
    if (!block.isSelected) return;

    var event = new createjs.Event('blockdeselect');
    event._target = block;
    this.dispatchEvent(event);

    block.deselect();
    var index = this.selectedBlocks.indexOf(block);
    if (index > -1) this.selectedBlocks.splice(index, 1);
  }
  p.selectAll = function() {
    for (var i=0; i<this.blocks.length; i++) {
      this.select(this.blocks[i]);
    }
  }
  p.deselectAll = function() {
    for (var i=0; i<this.selectedBlocks.length; i++) {
      var event = new createjs.Event('blockdeselect');
      event._target = this.selectedBlocks[i];
      this.dispatchEvent(event);
      this.selectedBlocks[i].deselect();
    }

    this.selectedBlocks = [];
  }
  p.invertSelection = function(block) {
    var blocks = (block)?[block]:this.blocks;

    for (var i=0; i<blocks.length; i++) {
      var block = blocks[i];

      if (block.isSelected) {
        this.deselect(block);
      } else {
        this.select(block);
      }
    }
  }

  p.copy = function() {
    this.clipboard = [];

    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.category != 'root') {
        this.clipboard.push(block)
      }
    }
  }
  p.cut = function() {
    this.clipboard = [];

    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.category != 'root') {
        this.removeBlock(block);
        this.clipboard.push(block)
      }
    }
    this.selectedBlocks = [];
  }
  p.paste = function() {
    var newBlocks = [];
    for (var i=0; i<this.clipboard.length; i++) {
      var block = this.clipboard[i];

      // Copy the block
      var newBlock = block.copy();
      newBlock.displayObject.x += 50;
      newBlock.displayObject.y += 50;

      // Add block to container
      this.blocks.push(newBlock)
      app.game.layerBlocks.addChild(newBlock.displayObject);
      newBlocks.push(newBlock);
    }

    // Copy connections
    // TODO: cubic complexity here! How to make it better?
    for (var i=0; i<this.clipboard.length; i++) {
      var oldBlock = this.clipboard[i];
      var newBlock = newBlocks[i];

      for (var j=0; j<oldBlock.outConnections.length; j++) {
        for (var k=0; k<this.clipboard.length; k++) {
          if (oldBlock.outConnections[j].outBlock === this.clipboard[k]) {
            this.addConnection(newBlock, newBlocks[k]);
            break;
          }
        }
      }
    }

    // Deselect old blocks and select the new ones
    this.deselectAll();
    for (var i=0; i<newBlocks.length; i++) {
      this.select(newBlocks[i]);
    }

    this.snap(newBlocks);
  }
  p.remove = function() {
    var root = null;
    for (var i=0; i<this.selectedBlocks.length; i++) {
      if (this.selectedBlocks[i].category == 'root') {
        root = this.selectedBlocks[i];
      } else {
        this.removeBlock(this.selectedBlocks[i]);
      }
    }

    this.deselectAll();
    if (root) {
      this.select(root);
    }
  }

  p.removeConnections = function() {
    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.inConnection) {
        this.removeConnection(block.inConnection);
      }

      if (block.outConnections.length > 0) {
        for (var j=block.outConnections.length-1; j>=0; j--) {
          this.removeConnection(block.outConnections[j]);
        }
      }
    }
  }
  p.removeInConnections = function() {
    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.inConnection) {
        this.removeConnection(block.inConnection);
      }
    }
  }
  p.removeOutConnections = function() {
    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.outConnections.length > 0) {
        for (var j=block.outConnections.length-1; j>=0; j--) {
          this.removeConnection(block.outConnections[j]);
        }
      }
    }
  }

  p.zoomIn = function() {
    var min = app.settings.get('zoom_min');
    var max = app.settings.get('zoom_max');
    var step = app.settings.get('zoom_step');
    
    var zoom = app.game.camera.scaleX;
    this.zoom(creatine.clip(zoom+step, min, max));
  }
  p.zoomOut = function() {
    var min = app.settings.get('zoom_min');
    var max = app.settings.get('zoom_max');
    var step = app.settings.get('zoom_step');
    
    var zoom = app.game.camera.scaleX;
    this.zoom(creatine.clip(zoom-step, min, max));
  }
  // ==========================================================================

  b3editor.Editor = Editor;
}());
