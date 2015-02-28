"use strict";

var loader, app, editor, keyboard;

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function element(object) {
  return angular.element(object).scope();
}

function preload() {
  var domProgress = document.getElementById('loading-progress');
  var domLoading  = document.getElementById('loading-text');
  
  loader = new createjs.LoadQueue(true);

  // on progress
  loader.on('progress', function(event) {
    if (domProgress) {
      domProgress.innerHTML = Math.floor(event.progress*100)+'%';
    }
  });

  // on complete
  loader.on('complete', function(event) {
    domLoading.innerHTML = 'Initializing, please wait...';
    keyboard = key.noConflict();
    start();
    document.getElementById('preloading').remove();
  });

  // load
  loader.loadManifest(MANIFEST);
}


function start() {
  app = {};
  app.dom = {};
  app.dom.page = document.getElementById('page');
  app.dom.gameCanvas = document.getElementById('game-canvas');

  app.editor = new b3editor.Editor();
  app.game = app.editor.canvas;
  app.settings = app.editor.settings;

  angular.bootstrap(document, ['app']);
}

preload();