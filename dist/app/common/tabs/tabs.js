angular.module('app.tabs', [])

.controller('TabController', function($scope) {
  $scope.index = 1;
  
  $scope.select = function(id) {
    $scope.index = id;
  }
  $scope.visible = function(id) {
    return $scope.index == id;
  }
});
