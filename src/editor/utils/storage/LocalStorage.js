this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var LocalStorage = b3.Class();
  var p = LocalStorage.prototype;
  
  p.initialize = function() {
    this._prefix = 'b3editor.storage.'
    this._storage = window.localStorage;

    // Verify if browser supports the localStorage feature
    try {
        !!window.localStorage.getItem;
    } catch (error) {
        this._storage = {};
    }

    // Initialize lists if they do not exist
    if (!this._has('project-list')) this._set('project-list', []);
    if (!this._has('tree-list')) this._set('tree-list', []);
    if (!this._has('node-list')) this._set('node-list', []);
  }

  // Internal
  p._has = function(key) {
    return this._prefix+key in this._storage;
  }
  p._set = function(key, value) {
    try {
        value = JSON.stringify(value);
    } catch (e) {}

    this._storage[this._prefix+key] = value;
  }
  p._get = function(key) {
    var value = this._storage[this._prefix+key];
    try {
        value = JSON.parse(value);
    } catch (e) {}

    return value
  }
  p._remove = function(key) {
    delete this._storage[this._prefix+key];
  }

  // Interface
  p.set = function(context, key, value) {
    var prefixedKey = context+'.'+key;

    if (!this._has(prefixedKey)) {
      var list = this._get(context+'-list');
      list.push(key);
      this._set(context+'-list', list);
    }

    this._set(prefixedKey, value);
  }

  p.get = function(context, key) {
    return this._get(context+'.'+key);
  }

  p.remove = function(context, key) {
    var prefixedKey = context+'.'+key;

    if (!this._has(prefixedKey)) {
      var list = this._get(context+'-list');
      list.splice(list.indexOf(key), 1);
      this._set(context+'-list', list);
    }
    return this._remove(prefixedKey);
  }

  p.list = function(context) {
    return this._get(context+'-list');
  }

  b3editor.LocalStorage = LocalStorage;
}());
