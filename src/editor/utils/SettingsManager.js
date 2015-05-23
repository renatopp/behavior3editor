(function () {
  "use strict";

  var SettingsManager = function() {
    this._dict = {};
  }
  var p = SettingsManager.prototype;
  
  p.clear = function() {
    this._dict = {};
  }

  p.set = function(key, value) {
    this._dict[key] = value;
  }

  p.get = function(key) {
    return this._dict[key]
  }

  p.load = function(data) {
    for (var key in data) {
      this.set(key, data[key]);
    }
  }
 
  b3e.SettingsManager = SettingsManager;
})();