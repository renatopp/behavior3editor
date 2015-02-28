angular.module('app.property', [])

.controller('PropertyController', function($scope, $timeout, $compile, $window) {
  // DYNAMIC ROW
  this.panel = angular.element(
    document.querySelector('#property-panel')
  );
  this.table = angular.element(
    document.querySelector('#property-properties-table>tbody')
  );
  this.template = '\
    <tr>\
      <td><input id="key" type="text" value="{0}" onkeyup="element(this).updateProperties(this);" placeholder="key" /></td>\
      <td><input id="value" type="text" value="{1}" onkeyup="element(this).updateProperties(this);" placeholder="value" /></td>\
      <td><a href="#" propertyremovable class="button alert right">-</a></td>\
    </tr>\
  ';
  
  var this_ = this;
  $scope.addRow = function(key, value) {
    if (typeof key == 'undefined') key = '';
    if (typeof value == 'undefined') value = '';
    var template = this_.template.format(key, value);
    this_.table.append($compile(template)($scope));
  }

  // SELECTION/DESELECTION
  $scope.block = null;
  this.updateProperties = function() {
    if ($window.app.editor.selectedBlocks.length === 1) {
      var block = $window.app.editor.selectedBlocks[0];

      this_.table.html('');
      var domTitle = document.querySelector('#property-panel #title');
      var domDescription = document.querySelector('#property-panel #description');

      domTitle.value = block.title;
      domDescription.value = block.description;

      for (key in block.properties) {
        $scope.addRow(key, block.properties[key]);
      }
    } else {
      var block = null;
    }


    // timeout needed due to apply function
    // apply is used to update the view automatically when the scope is changed
    $timeout(function() {
      $scope.$apply(function() {
        $scope.block = block;
      });
    }, 0, false);
  }
  $window.app.editor.on('blockselected', this.updateProperties, this);
  $window.app.editor.on('blockdeselected', this.updateProperties, this);
  $window.app.editor.on('treeselected', this.updateProperties, this);
  this.updateProperties();

  // UPDATE PROPERTIES ON NODE
  $scope.updateProperties = function() {
    var domTitle = document.querySelector('#property-panel #title');
    var domDescription = document.querySelector('#property-panel #description');
    var domKeys = document.querySelectorAll('#property-panel #key');
    var domValues = document.querySelectorAll('#property-panel #value');

    var title = domTitle.value;
    var description = domDescription.value;
    var properties = {};

    for (var i=0; i<domKeys.length; i++) {
      var key = domKeys[i].value;
      var value = domValues[i].value;

      // verify if value is numeric
      if (!isNaN(value) && value !== '') {
        value = parseFloat(value);
      }

      if (key) {
        properties[key] = value;
      }
    }
    
    $window.app.editor.editBlock(
      $scope.block,
      {title: title, description:description, properties:properties}
    )
  }
})

.directive('propertypanel', function() {
  return {
    restrict: 'E',
    transclude: true,
    controller: 'PropertyController',
    templateUrl: 'app/property/property.html'
  }
})

.directive('propertyremovable', function() {    
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        element.parent().parent().remove();
        scope.updateProperties();
      });
    }
  };
});