angular.module('app.sidebar', [])

.directive('sidebar', function() {
  return {
    restrict: 'E',
    scope: {
      class:'@class',
    },
    transclude: true,
    templateUrl: 'app/common/sidebar/sidebar.html'
  }
});