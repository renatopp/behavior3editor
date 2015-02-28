
this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var OPTIONS = {
    // CAMERA
    zoom_initial  : 1.0,
    zoom_min      : 0.25,
    zoom_max      : 2.0,
    zoom_step     : 0.25,

    // EDITOR
    snap_x        : 16,
    snap_y        : 16,
    snap_offset_x : 0,
    snap_offset_y : 0,
    
    // CONNECTION
    connection_width       : 2,
    
    // ANCHOR
    anchor_border_width    : 2,
    anchor_radius          : 7,
    anchor_offset_x        : 4,
    anchor_offset_y        : 0,
    
    // BLOCK
    block_border_width     : 2,
    block_root_width       : 40,
    block_root_height      : 40,
    block_composite_width  : 40,
    block_composite_height : 40,
    block_decorator_width  : 60,
    block_decorator_height : 60,
    block_action_width     : 160,
    block_action_height    : 40,
    block_condition_width  : 160,
    block_condition_height : 40,
}

b3editor.OPTIONS = OPTIONS;
}());
