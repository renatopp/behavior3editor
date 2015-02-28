angular.module('app.tree')

.directive('treepanel', function() {
  return {
    restrict: 'E',
    controller: 'TreeController',
    templateUrl: 'app/tree/tree.html'
  }
});
