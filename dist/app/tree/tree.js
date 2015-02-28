angular.module('app.tree', ['app.modal'])


//
// TREE CONTROLLER
//
.controller('TreeController', function($scope, $rootScope, $window, $timeout, ModalService) {
  var this_ = this;

  // SHOW ADD NODE MODAL ------------------------------------------------------
  $scope.showEditTreeModal = function(treeId) {
    ModalService.showModal({
      templateUrl: "app/tree/modal-edittree.html",
      controller: 'EditTreeModalController',
      inputs: {'treeId': treeId}
    }).then(function(modal) {
      modal.close.then(function(result) {
      });
    });
  };
  // --------------------------------------------------------------------------
  
  $scope.currentTree = $window.app.editor.tree.id;

  $scope.canEditTree = function() {
    return $window.app.editor.trees.length > 1;
  }

  $scope.addTree = function() {
    $window.app.editor.addTree();
  }
  $scope.selectTree = function(id) {
    if (id !== $scope.currentTree) {
      $window.app.editor.selectTree(id);
    }
  }

  this.updateTrees = function(e, id) {
    var trees = $window.app.editor.trees;

    // update all trees
    if (!id) {
      var data = [];

      for (var i=0; i<trees.length; i++) {
        var tree = trees[i];
        var id = tree.id;
        var name = tree.blocks[0].title;
        data.push({id:id, name:name});
      }

      // timeout needed due to apply function
      // apply is used to update the view automatically when the scope is changed
      $timeout(function() {
        $scope.$apply(function() {
          $scope.trees = data;
        });
      }, 0, false);
    }

    // only update a specific tree
    else {
      for (var i=0; i<trees.length; i++) {
        var tree = trees[i];
        if (tree.id === id) {
          $timeout(function() {
            $scope.$apply(function() {
              $scope.trees[i].name = tree.blocks[0].getTitle();
            });
          }, 0, false);
          return
        }
      }
    }
  }
  this.onTreeSelected = function(e) {
    $timeout(function() {
      $scope.$apply(function() {
        $scope.currentTree = e._target.id;
      });
    }, 0, false);
  }
  this.onBlockChanged = function(e) {
    if (e._target.category === 'root' && e.oldValues.title !== e.newValues.title) {
      this.updateTrees(e, e._target.id);
    }
  }

  this.updateTrees();

  $window.app.editor.on('blockchanged', this.onBlockChanged, this);
  $window.app.editor.on('treeadded', this.updateTrees, this);
  $window.app.editor.on('treeremoved', this.updateTrees, this);
  $window.app.editor.on('treeselected', this.onTreeSelected, this);
  $rootScope.$on('onButtonNewTree', $scope.addTree);
})


//
// ADD TREE MODAL CONTROLLER
//
.controller('EditTreeModalController', function($scope, $window, $compile, close, treeId) {
  $scope.treeId = treeId;
  $scope.close = function(result) { close(result); };

  $scope.removeTree = function(id) {
    $window.app.editor.removeTree(id);
  }
});
