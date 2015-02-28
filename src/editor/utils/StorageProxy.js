this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var StorageProxy = b3.Class();
  var p = StorageProxy.prototype;
  
  p.initialize = function() {
    this.provider = null;
    this._contexts = ['project', 'tree', 'node'];
  }

  /**
   * Save a value on the storage. The value is identified by a key and a 
   * context. Contexts can be `'project'`, `tree' or `'node'`.
   * 
   * @param {String} context
   * @param {String} key
   * @param {Object} value
   */
  p.set = function(context, key, value) {
    if (this._contexts.indexOf(context) < 0) {
      throw 'Invalid context "'+context+'"';
    }
    this.provider.set(context, key, value);
  }

  /**
   * Retrieve a value from the storage. The value is identified by a key and a 
   * context. Contexts can be `'project'`, `tree' or `'node'`.
   * 
   * @param {String} context
   * @param {String} key
   */
  p.get = function(context, key) {
    if (this._contexts.indexOf(context) < 0) {
      throw 'Invalid context "'+context+'"';
    }
    return this.provider.get(context, key);
  }

  /**
   * Remove a value from the storage. The value is identified by a key and a 
   * context. Contexts can be `'project'`, `tree' or `'node'`.
   * 
   * @param {String} context
   * @param {String} key
   */
  p.remove = function(context, key) {
    if (this._contexts.indexOf(context) < 0) {
      throw 'Invalid context "'+context+'"';
    }
    this.provider.remove(context, key);
  }

  /**
   * Return a list of objects given the context
   * 
   * @param  {String} context
   */
  p.list = function(context) {
    if (this._contexts.indexOf(context) < 0) {
      throw 'Invalid context "'+context+'"';
    }
    return this.provider.list(context);
  }

  b3editor.StorageProxy = StorageProxy;
}());
