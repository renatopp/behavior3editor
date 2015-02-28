this.app = this.app || {};
this.app.events = this.app.events || {};

(function() {
  "use strict";

  /* EDITOR CALLBACKS ======================================================== */
  app.events.onBlockSelect = function(event) {
    var block = null;
    if (app.editor.selectedBlocks.length == 0) {
      block = event._target;
    }

    app.helpers.updateProperties(block);
  }
  app.events.onBlockDeselect = function(event) {
    var block = null;
    if (app.editor.selectedBlocks.length == 2) {
        block = (app.editor.selectedBlocks[0]!==event._target)?
                       app.editor.selectedBlocks[0] :
                       app.editor.selectedBlocks[1];
    }

    app.helpers.updateProperties(block);
  }
  /* ========================================================================= */

  /* NODES =================================================================== */
  app.events.onNodeDrag = function(event) {
    var canvas = $('<canvas id="preview-canvas" width="400", height="200"></canvas>');
    var name = $(this).attr('data-name');
    var node = app.editor.nodes[name];
    var block = new b3editor.Block(node);
    var shape = block.displayObject;
    shape.x = 200;
    shape.y = 100;
    var stage = new createjs.Stage(canvas.get(0));
    stage.addChild(shape);
    stage.update();

    canvas.addClass('grabbing');

    return canvas;
  }
  app.events.onNodeDrop = function(event, ui) {
    var name = $(ui.draggable).attr('data-name');
    var node = app.editor.nodes[name];
    var point = app.game.getLocalMousePosition();
    var block = app.editor.addBlock(node, point.x, point.y);
    app.editor.snap(block);
    app.editor.deselectAll();
    app.editor.select(block);
  }
  app.events.onOpenEditNodeModal = function(event) {
    var link = $(event.target).parent();
    var nodeName = link.attr('data-name');
    
    var node = app.editor.nodes[nodeName];
    app.dom.editNodeTable.attr('data-name', node.prototype.name);
    $('#name', app.dom.editNodeTable).val(node.prototype.name);
    $('#title', app.dom.editNodeTable).val(node.prototype.title);
    // $('#category', app.editNodeTable).val(node.prototype.category);
  }
  app.events.onNodeEditSave = function() {
    app.helpers.updateBlock();
    app.editor.deselectAll();

    var oldName = app.dom.editNodeTable.attr('data-name');
    var node = app.editor.nodes[oldName];
    var oldTitle = node.prototype.title;

    var newName = $('#name', app.dom.editNodeTable).val();
    var newTitle = $('#title', app.dom.editNodeTable).val();

    if (oldName !== newName && app.editor.nodes[newName]) {
        app.helpers.alert('error', 'Node name "'+newName+'" already registered.');
        return;
    }

    node.prototype.name = newName;
    node.prototype.title = newTitle;

    for (var i=0; i<app.editor.blocks.length; i++) {
        var block = app.editor.blocks[i];
        if (block.node === node) {
            block.name = newName;
            if (block.title === oldTitle || block.title === oldName) {
                block.title = newTitle || newName;
            }
            block.redraw();
        }
    }

    delete app.editor.nodes[oldName];
    app.editor.nodes[newName] = node;

    app.helpers.updateNodes();
  }
  app.events.onNodeEditRemove = function() {
    app.helpers.updateBlock();
    app.editor.deselectAll();

    var oldName = app.dom.editNodeTable.attr('data-name');
    var node = app.editor.nodes[oldName];

    for (var i=app.editor.blocks.length-1; i>=0; i--) {
        var block = app.editor.blocks[i];
        if (block.node === node) {
            app.editor.removeBlock(block);
        }
    }

    delete app.editor.nodes[oldName];

    app.helpers.updateNodes();
  }
  /* ========================================================================= */

  /* PROPERTIES ============================================================== */
  app.events.onAddEditableRow = function(table) {
    app.helpers.addEditableRow(table);
  }
  app.events.onRemEditableRow = function(event) {
    var id = $(event.target).attr('data-id');
    app.helpers.remEditableRow($(this).parent());
  }
  app.events.onPropertyChange = function(obj) {
    app.helpers.updateBlock();
  }
  app.events.onAddDynamicRow = function(table) {
    app.helpers.addDynamicRow(table);
  }
  app.events.onRemDynamicRow = function(event) {
    var id = $(event.target).attr('data-id');
    app.helpers.remDynamicRow($(this).parent());
  }
  /* ========================================================================= */

  /* MENU FILE =============================================================== */
  app.events.onButtonNewTree = function(event) {
    app.editor.reset();
    app.editor.center();
    return false;
  }
  app.events.onButtonImportTree = function(event) {
    var json = app.dom.importEntry.val();

    try {
      app.editor.importFromJSON(json);
      app.helpers.updateNodes();
    } catch (e) {
      app.helpers.alert('error', 'Bad input format, check the console to '+
                                 'know more about this error.');
      console.error(e);
      app.editor.center();
    }
    return false;
  }
  app.events.onButtonExportTree = function(event) {
    app.helpers.updateBlock();
    
    app.dom.exportEntry.val('');
    var json = app.editor.exportToJSON();
    app.dom.exportEntry.val(json);
    return false;
  }
  /* ========================================================================= */

  /* MENU EDIT =============================================================== */
  app.events.onButtonCopy = function(event) {
    app.editor.copy();
    return false;
  }
  app.events.onButtonCut = function(event) {
    app.editor.cut();
    return false;
  }
  app.events.onButtonPaste = function(event) {
    app.editor.paste();
    return false;
  }
  app.events.onButtonRemove = function(event) {
    app.editor.remove();
    return false;
  }
  app.events.onButtonRemoveConnections = function(event) {
    app.editor.removeConnections();
    return false;
  }
  app.events.onButtonRemoveInConnections = function(event) {
    app.editor.removeInConnections();
    return false;
  }
  app.events.onButtonRemoveOutConnections = function(event) {
    app.editor.removeOutConnections();
    return false;
  }
  /* ========================================================================= */

  /* MENU VIEW =============================================================== */
  app.events.onButtonAutoOrganize = function(event) {
    app.editor.organize();
    return false;
  }
  app.events.onButtonZoomIn = function(event) {
    app.editor.zoomIn();
    return false;
  }
  app.events.onButtonZoomOut = function(event) {
    app.editor.zoomOut();
    return false;
  }
  /* ========================================================================= */

  /* MENU SELECTION ========================================================== */
  app.events.onButtonSelectAll = function(event) {
    app.editor.selectAll(); return false;
  }
  app.events.onButtonDeselectAll = function(event) {
    app.editor.deselectAll(); return false;
  }
  app.events.onButtonInvertSelection = function(event) {
    app.editor.invertSelection(); return false;
  }
  /* ========================================================================= */

})();