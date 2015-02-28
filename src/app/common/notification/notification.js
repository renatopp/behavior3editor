angular.module('app.notification', [])

.controller('NotificationController', function($scope, $window, $compile, $document) {
  var this_ = this;
  this.template = '\
  <div class="notification {0}">\
    {1}\
  </div>\
  ';
  this.createNotification = function(level, message) {
    var element = $compile(
      this.template.format(level, message)
    )($scope);
    var body = $document.find('body');
    var this_ = this;

    // remove on click
    element.bind('click', function() {
      element.css('opacity', 0);
      setTimeout(function() {
        element.remove();
      }, 500);
    });

    // remove in time
    setTimeout(function() {
      element.css('opacity', 0);
      setTimeout(function() {
        element.remove();
      }, 500);
    }, 3000);

    // appear
    setTimeout(function() {
      element.css('opacity', 1);
    }, 1);

    body.append(element);
  }

  this.onNotification = function(e) {
    this_.createNotification(e.level, e.message);
  }
  $window.app.editor.on('notification', this.onNotification, this);

});
