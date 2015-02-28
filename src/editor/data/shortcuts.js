
this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var SHORTCUTS = {
    key_select_all       : 'ctrl+a',
    key_deselect_all     : 'ctrl+shift+a',
    key_invert_selection : 'ctrl+i',

    key_copy             : 'ctrl+c',
    key_cut              : 'ctrl+x',
    key_paste            : 'ctrl+v',
    key_duplicate        : 'ctrl+d',
    key_remove           : 'delete',

    key_organize         : 'a',
    key_zoom_in          : 'ctrl+up',
    key_zoom_out         : 'ctrl+down',
    
    key_new_tree         : 'ctrl+t',
    key_new_node         : 'ctrl+n',
    key_import_tree      : '',
    key_export_tree      : '',
}

b3editor.SHORTCUTS = SHORTCUTS;
}());
