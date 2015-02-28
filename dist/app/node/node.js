angular.module('app.node', ['app.modal'])

//
// NODE CONTROLLER
//
.controller('NodeController', function($scope, $rootScope, $window, $timeout, ModalService) {
  var this_ = this;

  // SCOPE --------------------------------------------------------------------
  $scope.categories = ['composite', 'decorator', 'condition', 'action'];
  $scope.nodes = {};
  
  $scope.showAddNodeModal = function() {
    ModalService.showModal({
      templateUrl: "app/node/modal-addnode.html",
      controller: 'AddNodeModalController'
    }).then(function(modal) {
      modal.close.then(function(result) {
      });
    });
  };

  $scope.showEditNodeModal = function(node) {
    ModalService.showModal({
      templateUrl: "app/node/modal-editnode.html",
      controller: 'EditNodeModalController',
      inputs: {'node': node}
    }).then(function(modal) {
      modal.close.then(function(result) {});
    });
  };

  $scope.canEditNode = function(name) {
    return !$window.b3[name];
  }

  $scope.getTitle = function(node) {
    var title = node.prototype.title || node.prototype.name;
    title = title.replace(/(<\w+>)/g, function(match, key) { return '@'; });
    return title;
  }
  // --------------------------------------------------------------------------

  // UPDATE NODES--------------------------------------------------------------
  this.updateNodes = function() {
    var guiNodes = {
      'composite' : [],
      'decorator' : [],
      'condition' : [],
      'action'    : []
    };
    var editorNodes = $window.app.editor.nodes;

    for (key in guiNodes) {
      for (nodeName in editorNodes) {
        var node = editorNodes[nodeName];
        if (node.prototype.category === key) {
          guiNodes[key].push(node);
        }
      }
    }
    
    // timeout needed due to apply function
    // apply is used to update the view automatically when the scope is changed
    $timeout(function() {
      $scope.$apply(function() {
        $scope.nodes = guiNodes;
      });
    }, 0, false);
  }
  // --------------------------------------------------------------------------

  // REGISTER EVENTS ----------------------------------------------------------
  $window.app.editor.on('nodeadded', this.updateNodes, this);
  $window.app.editor.on('noderemoved', this.updateNodes, this);
  $window.app.editor.on('nodechanged', this.updateNodes, this);
  $rootScope.$on('onButtonNewNode', $scope.showAddNodeModal);
  // --------------------------------------------------------------------------

  // INITIALIZE ELEMENTS ------------------------------------------------------
  this.updateNodes();
  // --------------------------------------------------------------------------
})


//
// ADD NODE MODAL CONTROLLER
//
.controller('AddNodeModalController', function($scope, $window, $compile, close) {
  $scope.close = function(result) { close(result); };
  
  // DYNAMIC TABLE ------------------------------------------------------------
  this.template = '\
    <tr>\
      <td><input id="name" type="text" placeholder="name" /></td>\
      <td><input id="title" type="text" placeholder="title" /></td>\
      <td>\
        <select id="category">\
          <option value="composite">Composite</option>\
          <option value="decorator">Decorator</option>\
          <option value="condition">Condition</option>\
          <option value="action" selected>Action</option>\
        </select>\
      </td>\
      <td><a href="#" propertyremovable class="button alert right">-</a></td>\
    </tr>\
  ';

  var this_ = this;
  $scope.addRow = function() {
    if (typeof key == 'undefined') key = '';
    if (typeof value == 'undefined') value = '';
    
    var table = document.querySelector('#addnode-properties-table>tbody');
    var template = $compile(this_.template)($scope);
    angular.element(table).append(template);
  }

  $scope.addNodes = function() {
    var domNames = document.querySelectorAll('#addnode-properties-table #name');
    var domTitles = document.querySelectorAll('#addnode-properties-table #title');
    var domCategories = document.querySelectorAll('#addnode-properties-table #category');
    
    for (var i=0; i<domNames.length; i++) {
      var name = domNames[i].value;
      var title = domTitles[i].value;
      var category = domCategories[i].value;

      if (name) {
        $window.app.editor.addNode(name, title, category)
      }
    }
  }
})


//
// EDIT NODE MODAL CONTROLLER
//
.controller('EditNodeModalController', function($scope, $window, $compile, close, node) {
  $scope.close = function(result) { close(result); };

  $scope.node = $window.app.editor.nodes[node];

  $scope.saveNode = function() {
    var domName = document.querySelector('#editnode-form #name');
    var domTitle = document.querySelector('#editnode-form #title');
    
    var name = domName.value;
    var title = domTitle.value;

    if (name) {
      $window.app.editor.editNode(node, name, title);
    }
  }

  $scope.removeNode = function() {
    $window.app.editor.removeNode(node);
  }
});