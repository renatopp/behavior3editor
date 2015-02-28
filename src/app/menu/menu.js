angular.module('app.menu', [])

.controller('MenuController', function($scope, $rootScope, $timeout, $window) {
  this.update = function() {
    var settings = $window.app.editor.settings;

    // UPDATE LABELS ON THE MENU
    $timeout(function() {
      $scope.$apply(function() {
        for (var k in settings._dict) {
          if (k.indexOf('key_') == 0) {
            var value = settings.get(k);
            $scope[k] = value;
          }
        }
      });
    }, 0, false);

    // UPDATE CALLBACKS
    $window.keyboard(settings.get('key_copy'), function(e) {$scope.onButtonCopy(e)});
    $window.keyboard(settings.get('key_cut'), function(e) {$scope.onButtonCut(e)});
    $window.keyboard(settings.get('key_paste'), function(e) {$scope.onButtonPaste(e)});
    $window.keyboard(settings.get('key_duplicate'), function(e) {$scope.onButtonDuplicate(e)});
    $window.keyboard(settings.get('key_remove'), function(e) {$scope.onButtonRemove(e)});
    $window.keyboard(settings.get('key_organize'), function(e) {$scope.onButtonAutoOrganize(e)});
    $window.keyboard(settings.get('key_zoom_in'), function(e) {$scope.onButtonZoomIn(e)});
    $window.keyboard(settings.get('key_zoom_out'), function(e) {$scope.onButtonZoomOut(e)});
    $window.keyboard(settings.get('key_select_all'), function(e) {$scope.onButtonSelectAll(e)});
    $window.keyboard(settings.get('key_deselect_all'), function(e) {$scope.onButtonDeselectAll(e)});
    $window.keyboard(settings.get('key_invert_selection'), function(e) {$scope.onButtonInvertSelection(e)});
    $window.keyboard(settings.get('key_new_tree'), function(e) {$scope.onButtonNewTree(e)});
    $window.keyboard(settings.get('key_new_node'), function(e) {$scope.onButtonNewNode(e)});
    $window.keyboard(settings.get('key_import_tree'), function(e) {$scope.onButtonCopy(e)});
    $window.keyboard(settings.get('key_export_tree'), function(e) {$scope.onButtonCopy(e)});
  }
  this.update();
  $window.app.editor.on('shortcutsChanged', this.update, this);

  // CALLBACKS ----------------------------------------------------------------
  // this.onButtonNewProject = function(e) {}
  // ...
  $scope.onButtonNewTree = function(e) {
    if (e) e.preventDefault();
    $rootScope.$broadcast('onButtonNewTree');
    return false;
  }
  $scope.onButtonNewNode = function(e) {
    if (e) e.preventDefault();
    $rootScope.$broadcast('onButtonNewNode');
    return false;
  }
  $scope.onButtonCopy = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.copy();
  }
  $scope.onButtonCut = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.cut();
  }
  $scope.onButtonPaste = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.paste();
  }
  $scope.onButtonDuplicate = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.duplicate();
  }
  $scope.onButtonRemove = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.remove();
  }
  $scope.onButtonRemoveAllConnections = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.removeConnections();
  }
  $scope.onButtonRemoveInConnections = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.removeInConnections();
  }
  $scope.onButtonRemoveOutConnections = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.removeOutConnections();
  }
  $scope.onButtonAutoOrganize = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.organize();
  }
  $scope.onButtonZoomIn = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.zoomIn();
  }
  $scope.onButtonZoomOut = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.zoomOut();
  }
  $scope.onButtonSelectAll = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.selectAll();
  }
  $scope.onButtonDeselectAll = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.deselectAll();
  }
  $scope.onButtonInvertSelection = function(e) {
    if (e) e.preventDefault();
    $window.app.editor.invertSelection();
  }
  // --------------------------------------------------------------------------

})

.directive('menu', function() {
  return {
    restrict: 'E',
    controller: 'MenuController',
    templateUrl: 'app/menu/menu.html'
  }
});