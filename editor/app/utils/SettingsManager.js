this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  /**
   *  SettingsManager
  **/
  var SettingsManager = b3.Class();
  var p = SettingsManager.prototype;

    p.initialize = function() {
        this._dict = {};
    }
    p.clear = function() {
        this._dict = {};
    };
    p.set = function(key, value) {
        this._dict[key] = value;
    };
    p.get = function(key) {
        return this._dict[key]
    };
    p.load = function(data) {
        for (var key in data) {
            this.set(key, data[key]);
        }
    };    

  b3editor.SettingsManager = SettingsManager;
}());
