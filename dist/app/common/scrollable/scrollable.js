angular.module('app.scrollable', [])

.directive('scrollable', function($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes, controller) {
      var resize = function() {
        var e = element.parent().parent().parent().parent();
        element[0].style.height = e[0].offsetHeight-175 + 'px';
      }
      $window.addEventListener('resize', resize, true);
      resize();
    }
  }
});
