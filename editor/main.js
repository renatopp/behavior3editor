"use strict";

var loader, app;

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
    app.initialize();
    $('#preloading').fadeOut(250);
  });

  // load
  loader.loadManifest(MANIFEST);
}
// 

preload();